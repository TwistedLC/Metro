import React, { useState, useRef } from 'react';
import { Button, Card, Form, Row, Col, Select, DatePicker, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import DeleteText from '@/components/DeleteText';
import { history, connect } from 'umi';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import RoleList from '@/components/RoleList';
import FooterToolbar from '@/components/FooterToolbar';
import Choosebu from './choosebusiness';
import { addauther } from '../services';
import Styles from '../index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const SafeguardForm = ({ dispatch }) => {
  const ref = useRef();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [roidName, setRoleName] = useState('');
  const [roidId, setRoleId] = useState('');
  const [userList, setUserList] = useState([]);
  const [documentList, setdocumentList] = useState([]);
  const [basicMsg, setbasicMsg] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const submit = async () => {
    setSubmitLoading(true);
    const response = await addauther({ list: documentList });
    if (response.code === 200) {
      history.goBack();
    }
    if (response.code === 500) {
      message.error(response.msg);
    }
    setSubmitLoading(false);
  };

  const addNewbusiness = async () => {
    const formData = await form.validateFields();
    setbasicMsg(formData);
    setVisible(true);
  };

  const roleChange = (value, op) => {
    setRoleName(op.children);
    setRoleId(value);
    form.resetFields(['userId']);
    dispatch({
      type: 'documentAuth/getRoleUser',
      payload: { roleId: value },
    }).then((res) => {
      if (res) {
        setUserList(res);
      }
    });
  };

  const deleteSameDocument = (data) => {
    const oldData = documentList;
    const newData = data;
    let flag = false;
    if (oldData.length === 0) {
      return newData;
    }
    if (oldData.length > 0) {
      for (let i = 0; i < oldData.length; i += 1) {
        for (let j = 0; j < newData.length; j += 1) {
          if (
            oldData[i].receiveUser === newData[j].receiveUser &&
            oldData[i].autherRoleNa === newData[j].autherRoleNa
          ) {
            newData.splice(j, 1);
            flag = true;
          }
        }
      }
      if (flag) {
        message.info('?????????????????????????????????????????????????????????????????????????????????');
      }
    }
    return newData;
  };

  const deleteDocument = (index) => {
    const oldArr = documentList;
    const newArr = oldArr.filter((item, idx) => {
      return index !== idx;
    });
    setdocumentList(newArr);
  };

  const toolBarRender = (
    <Button
      key="add"
      type="primary"
      onClick={() => {
        addNewbusiness();
      }}
    >
      ??????
    </Button>
  );

  const columns = [
    {
      title: '???????????????',
      dataIndex: 'receiveRoleName',
    },
    {
      title: '????????????',
      dataIndex: 'receiveUser',
    },
    {
      title: '????????????',
      dataIndex: 'autherRoleNa',
    },
    {
      title: '????????????',
      dataIndex: 'beginTime',
      valueType: 'date',
    },
    {
      title: '????????????',
      dataIndex: 'endTime',
      valueType: 'date',
    },
    {
      title: '??????',
      dataIndex: 'action',
      render: (_, record, index) => {
        return (
          <DeleteText
            text="????????????"
            deleteFunc={() => {
              deleteDocument(index);
            }}
          />
        );
      },
    },
  ];

  const choosebuin = {
    roidName,
    basicMsg,
    roidId,
    vis: visible,
    onCancel: (data) => {
      setVisible(data);
    },
    setdocument: (data) => {
      setdocumentList([...documentList, ...deleteSameDocument(data)]);
    },
  };

  const disabledDate = (date) => {
    if (!date) {
      return false;
    }
    return date < moment().subtract(1, 'days');
  };

  return (
    <PageContainer ghost title={false}>
      <Card title="????????????">
        <Form form={form} layout="vertical">
          <Row gutter={64}>
            <Col span={8}>
              <FormItem
                label="???????????????"
                name="roleId"
                rules={[
                  {
                    required: true,
                    message: '??????????????????????????????',
                  },
                ]}
              >
                <RoleList
                  Single
                  onChange={(value, op) => {
                    roleChange(value, op);
                  }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="????????????"
                name="userId"
                rules={[
                  {
                    required: true,
                    message: '???????????????????????????',
                  },
                ]}
              >
                <Select mode="multiple" labelInValue>
                  {(userList || []).map((item) => {
                    return (
                      <Option key={item.userId} value={item.userId}>
                        {item.userName}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label="????????????"
                name="time"
                rules={[
                  {
                    required: true,
                    message: '???????????????????????????',
                  },
                ]}
              >
                <RangePicker disabledDate={disabledDate} />
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
          rowKey="taskId"
          dataSource={documentList}
          search={false}
          actionRef={ref}
          options={false}
          toolBarRender={false}
          pagination={false}
          columns={columns}
        />
      </Card>
      <Choosebu {...choosebuin} />
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
          loading={submitLoading}
          onClick={() => {
            submit();
          }}
        >
          ??????
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};

export default connect(({ documentAuth, loading }) => ({
  documentAuth,
  loadinguser: loading.effects['documentAuth/getRoleUser'],
}))(SafeguardForm);
