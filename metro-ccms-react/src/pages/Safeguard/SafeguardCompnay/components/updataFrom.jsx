import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Button,
  Divider,
  Card,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  message,
  Menu,
  Dropdown,
  Modal,
  Spin,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history, connect } from 'umi';
import numeral from 'numeral';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import { DownOutlined } from '@ant-design/icons';
import FooterToolbar from '@/components/FooterToolbar';
import EndDateTime from '@/components/EndDateTime';
import DeleteText from '@/components/DeleteText';
import { update, details, timeJudgment, policyJudgment } from '../service';
import PolicyModal from './policyModal';
import Styles from '../index.less';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const currentDate = moment().format(dateFormat);

let textId = `a${1}`;

const SafeguardForm = ({
  dispatch,
  loadingdetails,
  loadingboundary,
  safeguardCompnay: { boundaryData },
}) => {
  const ref = useRef();
  const [form] = Form.useForm();
  const [policyVis, setPolicyVis] = useState(false);
  const [policyList, setpolicyList] = useState([]);
  const [modifyList, setModefiyList] = useState([]);
  const [addList, setAddList] = useState([]);
  const [updataloading, setloading] = useState(false);
  const [boundaryVis, setBoundaryVis] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [idx, setID] = useState(null);
  const [mainId, setMainId] = useState(null);
  const [formdata, setformdata] = useState({});
  const [delId, setDelId] = useState([]);
  const [rowList, setRowList] = useState([]);

  const query = async () => {
    const { id } = history.location.query;
    if (!id) {
      return;
    }
    setPageLoading(true);
    const response = await details({ id });
    const { code, msg, data } = response;
    if (code === 200) {
      const { insurePolicyVOList, validFrom, validTo, status, compCode, compName } = data;
      form.setFieldsValue({
        status,
        compCode,
        compName,
        validFrom: validFrom ? moment(validFrom) : '',
        validTo: validTo ? moment(validTo) : '',
      });
      setMainId(id);
      setpolicyList(insurePolicyVOList);
    } else {
      message.error(msg);
    }
    setPageLoading(false);
  };

  const queryBoundary = (param = {}) => {
    dispatch({
      type: 'safeguardCompnay/boundary',
      payload: param,
    });
  };

  useEffect(() => {
    query();
  }, []);

  const toolBarRender = (
    <Button
      key="add"
      type="primary"
      onClick={() => {
        setID(1);
        setPolicyVis(true);
        setformdata(form.getFieldValue());
        setRowList(policyList);
      }}
    >
      ??????
    </Button>
  );

  const removeTextId = (id) => {
    const modefiy = modifyList;
    const afterRemove = modefiy.filter((item) => item.textId !== id);
    return afterRemove;
  };

  const getUpdataMsg = (dataModefily) => {
    const oldData = policyList;
    const newArr = [];
    const modefilyData = dataModefily;
    for (let i = 0; i < oldData.length; i += 1) {
      if (oldData[i].id) {
        if (oldData[i].id === dataModefily.id) {
          modefilyData.idType = dataModefily.id;
          oldData.splice(i, 1, modefilyData);
          setModefiyList([...modifyList, modefilyData]);
          newArr.push(...oldData);
        }
      } else if (oldData[i].textId === dataModefily.textId) {
        const noRemoveList = removeTextId(oldData[i].textId);
        modefilyData.idType = dataModefily.textId;
        oldData.splice(i, 1, modefilyData);
        const newAddData = [...noRemoveList, modefilyData];
        setModefiyList([...newAddData]);
        newArr.push(...oldData);
      }
    }
    return newArr;
  };

  // ??????????????????????????????
  const policyVOList = (aArr, uArr) => {
    let arr;
    if (aArr.length === 0 && uArr.length === 0) {
      arr = [];
    }
    if (aArr.length === 0 && uArr.length > 0) {
      arr = uArr;
    }
    if (aArr.length > 0 && uArr.length === 0) {
      arr = aArr;
    }
    if (aArr.length > 0 && uArr.length > 0) {
      for (let i = 0; i < aArr.length; i += 1) {
        for (let j = 0; j < uArr.length; j += 1) {
          if (aArr[i].id === uArr[j].id) {
            aArr.splice(i, 1);
          }
        }
      }
      arr = [...aArr, ...uArr];
    }
    return arr;
  };

  // ??????
  const submit = async () => {
    const formMsg = await form.validateFields();
    setloading(true);
    const param = {
      ...formMsg,
      id: mainId,
      deleteId: delId,
      insurePolicyVOList: policyVOList(addList, modifyList),
      validFrom: moment(formMsg.validFrom).format(dateFormat),
      validTo: moment(formMsg.validTo).format(dateFormat),
    };
    const titmParams = {
      ...formMsg,
      insurePolicyVOList: policyList,
    };
    const response = await timeJudgment(titmParams);
    if (response.code === 500) {
      message.error(response.msg);
      setloading(false);
      return;
    }
    if (response.code === 200) {
      const res = await update(param);
      const { msg, code } = res;
      if (code === 500) {
        message.error(msg);
      }
      if (code === 200) {
        history.goBack();
      }
      setloading(false);
    }
  };

  // ????????????
  const deleteMsg = async (res) => {
    const response = await policyJudgment({ policyno: res.policyno });
    if (response.code === 500) {
      message.error(response.msg);
      return;
    }
    if (response.code === 200) {
      const newList = policyList;
      const newcardData = newList.filter((item) => item.policyno !== res.policyno);
      setpolicyList(newcardData);
      if (res.id) {
        setDelId([...delId, res.id]);
      }
      if (res.textId) {
        const aList = addList;
        const uList = modifyList;
        const newAddList = aList.filter((item) => item.textId !== res.textId);
        const newUpList = uList.filter((item) => item.textId !== res.textId);
        setModefiyList(newUpList);
        setAddList(newAddList);
      }
    }
  };

  // ??????????????????
  const checkBoundary = (res) => {
    setBoundaryVis(true);
    const params = {
      policId: res.id,
      storeCodeList: res.insureScopeDOList,
    };
    queryBoundary(params);
  };

  const menu = (res) => (
    <Menu>
      <Menu.Item key="del">
        <DeleteText deleteFunc={() => deleteMsg(res)} />
      </Menu.Item>
      {typeof res.id === 'number' ? (
        <Menu.Item key="det">
          <a onClick={() => checkBoundary(res)} target="_blank">
            ??????????????????
          </a>
        </Menu.Item>
      ) : (
        ''
      )}
    </Menu>
  );

  const columns = [
    {
      title: '?????????',
      dataIndex: 'policyno',
      ellipsis: true,
      width: 150,
      fixed: 'left',
    },
    {
      title: '????????????',
      dataIndex: 'body',
      ellipsis: true,
      width: 100,
      fixed: 'left',
    },
    {
      title: '??????????????????????????????',
      dataIndex: 'policySum',
      ellipsis: true,
      width: 180,
      align: 'right',
      render: (_, record) => numeral(record.policySum).format('0,0.00'),
    },
    {
      title: '??????????????????????????????',
      dataIndex: 'maxpaySum',
      width: 180,
      align: 'right',
      render: (_, record) => numeral(record.maxpaySum).format('0,0.00'),
    },
    {
      title: '???????????????%???',
      dataIndex: 'payLv',
      align: 'right',
      width: 120,
    },
    {
      title: '???????????????????????????',
      dataIndex: 'payperiod',
      width: 180,
      align: 'right',
    },
    {
      title: '????????????????????????',
      dataIndex: 'quotafree',
      width: 150,
      align: 'right',
    },
    {
      title: '????????????????????????',
      dataIndex: 'paywait',
      width: 150,
      align: 'right',
    },
    {
      title: '??????',
      dataIndex: 'currency',
      width: 100,
    },
    {
      title: '????????????',
      dataIndex: 'validFrom',
      width: 130,
      valueType: 'date',
    },
    {
      title: '????????????',
      dataIndex: 'validTo',
      width: 130,
      valueType: 'date',
    },
    {
      title: '?????????',
      dataIndex: 'createdBy',
      width: 130,
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      width: 130,
      valueType: 'date',
    },
    {
      title: '??????',
      dataIndex: 'action',
      width: 130,
      fixed: 'right',
      render: (_, record, index) => {
        return (
          <Fragment>
            <a
              onClick={() => {
                setID(2);
                setPolicyVis(true);
                setformdata(record);
                setRowList(policyList);
              }}
            >
              ??????
            </a>
            <Divider type="vertical" />
            <Dropdown overlay={() => menu(record, index)}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                ?????? <DownOutlined />
              </a>
            </Dropdown>
          </Fragment>
        );
      },
    },
  ];

  const bouColumns = [
    {
      title: '????????????',
      dataIndex: 'storeCode',
      key: 'storeCode',
      width: 200,
    },
    {
      title: '????????????',
      dataIndex: 'compName',
      key: 'compName',
      width: 200,
    },
  ];

  const policymodal = {
    mainId,
    formdata,
    rowList,
    id: idx,
    vis: policyVis,
    onCancel: (vis) => {
      setPolicyVis(vis);
      setformdata({});
    },
    queryList: (num, data) => {
      if (num === 1) {
        textId += 1;
        const addData = data;
        addData.textId = textId;
        addData.idType = textId;
        setpolicyList([...policyList, addData]);
        setAddList([...addList, addData]);
      }
      if (num === 2) {
        setpolicyList(getUpdataMsg(data));
      }
    },
  };

  return (
    <PageContainer ghost title={false}>
      <Spin spinning={pageLoading}>
        <Card title="????????????">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: 1,
              validFrom: moment(currentDate),
            }}
          >
            <Row gutter={64}>
              <Col span={8}>
                <FormItem
                  label="????????????"
                  name="compCode"
                  rules={[
                    {
                      required: true,
                      message: '????????????????????????',
                    },
                  ]}
                >
                  <Input disabled maxLength={15} placeholder="????????????15???" />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="????????????"
                  name="compName"
                  rules={[
                    {
                      required: true,
                      message: '????????????????????????',
                    },
                  ]}
                >
                  <Input placeholder="" />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="????????????"
                  name="validFrom"
                  rules={[
                    {
                      required: true,
                      message: '????????????????????????',
                    },
                  ]}
                >
                  <DatePicker />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="????????????"
                  name="validTo"
                  rules={[
                    {
                      required: true,
                      message: '????????????????????????',
                    },
                  ]}
                >
                  <EndDateTime />
                </FormItem>
              </Col>
              {/* <Col span={8}>
                <FormItem
                  label="????????????"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: '?????????????????????',
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value={1}>??????</Radio>
                    <Radio value={0}>??????</Radio>
                  </Radio.Group>
                </FormItem>
              </Col> */}
            </Row>
          </Form>
        </Card>
        <Card
          className={Styles.extraStyle}
          title="????????????"
          extra={toolBarRender}
          style={{ marginTop: '24px' }}
        >
          <ProTable
            headerTitle=""
            rowKey="policyno"
            dataSource={policyList}
            search={false}
            actionRef={ref}
            options={false}
            loading={loadingdetails}
            toolBarRender={false}
            pagination={false}
            columns={columns}
            scroll={{ x: 2150 }}
          />
        </Card>
        <PolicyModal {...policymodal} />
        <Modal
          title="????????????"
          width={700}
          visible={boundaryVis}
          onCancel={() => {
            setBoundaryVis(false);
          }}
          footer={null}
        >
          <ProTable
            headerTitle=""
            rowKey="storeCode"
            bordered
            dataSource={boundaryData}
            search={false}
            options={false}
            loading={loadingboundary}
            toolBarRender={false}
            pagination={false}
            columns={bouColumns}
            scroll={{ y: 500 }}
          />
        </Modal>
        <FooterToolbar>
          <Button
            key="back"
            onClick={() => {
              history.goBack();
            }}
          >
            ??????
          </Button>
          <Button
            type="primary"
            loading={updataloading}
            onClick={() => {
              submit();
            }}
          >
            ??????
          </Button>
        </FooterToolbar>
      </Spin>
    </PageContainer>
  );
};

export default connect(({ safeguardCompnay, loading }) => ({
  safeguardCompnay,
  loadingboundary: loading.effects['safeguardCompnay/boundary'],
}))(SafeguardForm);
