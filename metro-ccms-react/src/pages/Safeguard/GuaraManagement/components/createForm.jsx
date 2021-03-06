/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  InputNumber,
  message,
  Select,
} from 'antd';
import moment from 'moment';
import EndDateTime from '@/components/EndDateTime';
import { PageContainer } from '@ant-design/pro-layout';
import { history, connect } from 'umi';
import ProTable from '@ant-design/pro-table';
import FooterToolbar from '@/components/FooterToolbar';
import UpdataFile from '@/components/UpdataFile';
import { promiseAll, deleteUploadList } from '@/services/commom';
import ChooseCustomer from '@/components/CustomerList';
import CardList from '@/components/CardList';
import { aaddForm } from '../service';
import Styles from '../index.less';

const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

const SafeguardForm = ({ dispatch, commonmodel: { basciData } }) => {
  const ref = useRef();
  const [form] = Form.useForm();
  const [menVis, setMemVis] = useState(false);
  const [cusVis, setCusVis] = useState(false);
  const [fileList, setFile] = useState([]);
  const [fileNew, setFileList] = useState([]);
  const [newcardList, setNewcardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardParams, setCardParams] = useState({});

  const getGuarantList = () => {
    dispatch({
      type: 'commonmodel/basciData',
      payload: { ctype: 'GuaranteeType' },
    });
  };

  useEffect(() => {
    getGuarantList();
  }, []);

  const sunmitFrom = async () => {
    const formValue = await form.validateFields();
    setLoading(true);
    const params = {
      ...formValue,
      validFrom: moment(formValue.validFrom).format(dateFormat),
      validTo: moment(formValue.validTo).format(dateFormat),
      guaranteeScopeDOList: newcardList,
    };
    const response = await aaddForm(params);
    const { code, data, msg } = response;
    if (code === 500) {
      message.error(msg);
      setLoading(false);
    }
    if (code === 200) {
      if (fileNew.length === 0) {
        setLoading(false);
        history.goBack();
        return;
      }
      promiseAll(data.id, 9, fileNew);
      history.goBack();
    }
    setLoading(false);
  };

  const onSearch = () => {
    setCusVis(true);
  };

  const addCustCode = async () => {
    const custCode = await form.validateFields(['custCode']);
    setCardParams(custCode);
    setMemVis(true);
  };

  const toolBarRender = (
    <Button
      key="add"
      type="primary"
      onClick={() => {
        addCustCode();
      }}
    >
      ??????
    </Button>
  );

  const deleteMsg = async (res) => {
    const newList = newcardList;
    const newcardData = newList.filter((item) => item.id !== res.id);
    setNewcardList(newcardData);
  };

  const getNewListDel = (id) => {
    const newArr = fileNew;
    const newFileList = newArr.filter((item) => {
      return item.uid !== id;
    });
    return newFileList;
  };

  const updataFile = {
    dataSource: fileList,
    loadFun: (id) => {
      setFile(deleteUploadList(id, fileList));
      setFileList(getNewListDel(id));
    },
    changeFun: (file, fileUpList) => {
      setFileList([...fileNew, file]);
      setFile([...fileList, fileUpList]);
    },
  };

  const deleteSameMsg = (arrOld, arrNew) => {
    const newData = arrNew;
    for (let i = 0; i < arrOld.length; i += 1) {
      for (let j = 0; j < newData.length; j += 1) {
        if (
          arrOld[i].storeCode + arrOld[i].cardCode ===
          newData[j].storeCode + newData[j].cardCode
        ) {
          message.info('????????????????????????????????????????????????');
          return;
        }
      }
    }
    return newData;
  };

  const columns = [
    {
      title: '????????????',
      dataIndex: 'storeCode',
      key: 'storeCode',
    },
    {
      title: '????????????',
      dataIndex: 'cardCode',
      key: 'cardCode',
    },
    {
      title: '????????????',
      dataIndex: 'cardName',
      key: 'cardName',
    },
    {
      title: '????????????',
      dataIndex: 'custCode',
      key: 'cardName',
    },
    {
      title: '????????????',
      dataIndex: 'custName',
      key: 'cardName',
    },
    {
      title: '??????',
      dataIndex: 'action',
      render: (_, record) => {
        return <a onClick={() => deleteMsg(record)}>??????</a>;
      },
    },
  ];

  const chooseCustomer = {
    visible: cusVis,
    onCancel: (vis) => {
      setCusVis(vis);
    },
    getFormData: (data) => {
      form.setFieldsValue(data);
    },
  };

  const cardList = {
    visible: menVis,
    params: cardParams,
    onCancel: (vis) => {
      setMemVis(vis);
    },
    getCardList: (data) => {
      setNewcardList([...newcardList, ...deleteSameMsg(newcardList, data)]);
    },
  };

  return (
    <PageContainer ghost title={false}>
      <Card title="????????????">
        <Form form={form} layout="vertical">
          <Row gutter={64}>
            <Col span={8}>
              <FormItem
                label="???????????????"
                name="gtcode"
                rules={[
                  {
                    required: true,
                    message: '???????????????????????????',
                  },
                ]}
              >
                <Input placeholder="????????????32???" maxLength={32} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="???????????????"
                name="guaranteetype"
                rules={[
                  {
                    required: true,
                    message: '???????????????????????????',
                  },
                ]}
              >
                <Select allowClear>
                  {(basciData || []).map((item) => {
                    return (
                      <Option key={`${item.ctype}`} value={`${item.ctype}`}>
                        {item.description}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="????????????"
                name="custCode"
                rules={[
                  {
                    required: true,
                    message: '????????????????????????',
                  },
                ]}
              >
                <Search
                  readOnly
                  placeholder="????????????32???"
                  maxLength={32}
                  onSearch={onSearch}
                  enterButton
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="????????????"
                name="custName"
                rules={[
                  {
                    required: true,
                    message: '????????????????????????',
                  },
                ]}
              >
                <Input readOnly placeholder="" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="?????????????????????"
                name="gtsum"
                rules={[
                  {
                    required: true,
                    message: '????????????????????????',
                  },
                  {
                    validator: (_, value) =>
                      value < 0
                        ? Promise.reject(new Error('??????????????????????????????'))
                        : Promise.resolve(),
                  },
                ]}
              >
                <InputNumber placeholder="????????????16???" maxLength={16} />
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
                    message: '?????????????????????',
                  },
                ]}
              >
                <EndDateTime />
              </FormItem>
            </Col>
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
          rowKey="id"
          bordered
          dataSource={newcardList}
          search={false}
          actionRef={ref}
          options={false}
          toolBarRender={false}
          pagination={false}
          columns={columns}
        />
      </Card>
      <UpdataFile {...updataFile} />
      <ChooseCustomer {...chooseCustomer} />
      <CardList {...cardList} />
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
          onClick={() => {
            sunmitFrom();
          }}
          loading={loading}
          type="primary"
        >
          ??????
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};

export default connect(({ commonmodel }) => ({
  commonmodel,
}))(SafeguardForm);
