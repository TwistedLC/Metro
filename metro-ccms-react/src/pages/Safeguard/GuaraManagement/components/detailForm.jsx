import React, { useState, useRef, Fragment, useEffect } from 'react';
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
  Spin,
} from 'antd';
import moment from 'moment';
import EndDateTime from '@/components/EndDateTime';
import { PageContainer } from '@ant-design/pro-layout';
import { history, connect } from 'umi';
import ProTable from '@ant-design/pro-table';
import FooterToolbar from '@/components/FooterToolbar';
import { downloadFile } from '@/services/commom';
import { detailsMsg } from '../service';
import Styles from '../index.less';

// const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;

const SafeguardForm = ({
  dispatch,
  commonmodel: { basciData },
}) => {
  const ref = useRef();
  const [form] = Form.useForm();
  const [fileList, setFile] = useState([]);
  const [newcardList, setNewcardList] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);

  // const getCusList = (params = {}) => {
  //   dispatch({
  //     type: 'commonmodel/customerlList',
  //     payload: params,
  //   });
  // };

  const getDetailsMsg = async () => {
    const { id } = history.location.query;
    if (id) {
      setLoadingPage(true);
      const response = await detailsMsg({ id });
      const { code, data, msg } = response;
      if (code === 200) {
        form.setFieldsValue({
          ...data,
          validFrom: moment(data.validFrom),
          validTo: moment(data.validTo),
        });
        setFile(data.list);
        setNewcardList(data.guaranteeScopeDOList);
        setLoadingPage(false);
      }
      if (code === 500) {
        message.error(msg);
        setLoadingPage(false);
      }
    }
    return false;
  };

  const getMemList = (params = {}) => {
    dispatch({
      type: 'commonmodel/memberlList',
      payload: params,
    });
  };

  const getGuarantList = () => {
    dispatch({
      type: 'commonmodel/basciData',
      payload: { ctype: 'GuaranteeType' },
    });
  };

  useEffect(() => {
    // getCusList();
    getDetailsMsg();
    getMemList();
    getGuarantList();
  }, []);

  // ??????
  const download = async (record) => {
    const { attachmentName, attachmentUrl } = record;
    const params = {
      fileName: attachmentName,
      filePath: attachmentUrl,
    };
    await downloadFile('/file/downAndUpload/downloadFile', params);
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
  ];

  // ??????
  const columnsUpload = [
    {
      title: '????????????',
      dataIndex: 'attachmentName',
      key: 'attachmentName',
    },
    {
      title: '??????',
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <Fragment>
            <a
              onClick={() => {
                download(record);
              }}
            >
              ??????
            </a>
          </Fragment>
        );
      },
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <Spin spinning={loadingPage}>
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
                  <Input disabled placeholder="" />
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
                  <Select disabled allowClear>
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
                  {/* <Search readOnly placeholder="?????????????????????" onSearch={onSearch} enterButton /> */}
                  <Input disabled />
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
                  <Input disabled placeholder="" />
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
                  <InputNumber disabled placeholder="" />
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
                  <DatePicker disabled />
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
                  <EndDateTime disabled />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          className={Styles.extraStyle}
          title="????????????"
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
        <Card
          className={Styles.extraStyle}
          title="????????????"
          style={{ marginTop: '24px' }}
        >
          <ProTable
            headerTitle=""
            rowKey="id"
            bordered
            dataSource={fileList}
            search={false}
            actionRef={ref}
            options={false}
            toolBarRender={false}
            pagination={false}
            columns={columnsUpload}
          />
        </Card>
        <FooterToolbar>
          <Button
            key="back"
            onClick={() => {
              history.goBack();
            }}
          >
            ??????
          </Button>
        </FooterToolbar>
      </Spin>
    </PageContainer>
  );
};

export default connect(({ commonmodel, loading }) => ({
  commonmodel,
  loadingCus: loading.effects['commonmodel/customerlList'],
  loadingMem: loading.effects['commonmodel/memberlList'],
}))(SafeguardForm);
