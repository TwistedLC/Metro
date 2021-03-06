import { Button, message, Input, Form, Card, Table, Popconfirm, Select, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { update, queryById } from '../service';
// import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const key = 'messageloading';
const queryType = {
  EQ: '=',
  NE: '!=',
  GT: '>',
  GTE: '>=',
  LT: '<',
  LTE: '<=',
  LIKE: 'LIKE',
  BETWEEN: 'BETWEEN',
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 18 },
  },
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const select = (
    <Select defaultValue="lucy" style={{ width: 120 }}>
      {Object.keys(queryType).map((ikey) => (
        <Option key={ikey} value={ikey}>
          {queryType[ikey]}
        </Option>
      ))}
    </Select>
  );
  const inputNode = inputType === 'Select' ? select : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
          children
        )}
    </td>
  );
};

const EditableTable = ({ originData, setOriginData }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.columnId === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.columnId);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (ikey) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => ikey === item.columnId);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setOriginData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setOriginData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.error('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '??????',
      dataIndex: 'sort',
      width: '5%',
    },
    {
      title: '????????????',
      dataIndex: 'columnName',
      width: '15%',
    },
    {
      title: '????????????',
      dataIndex: 'columnComment',
      editable: true,
      width: '20%',
    },
    {
      title: '????????????',
      dataIndex: 'columnType',
      width: '10%',
    },
    {
      title: 'JAVA??????',
      dataIndex: 'javaType',
      editable: true,
      width: '10%',
    },
    {
      title: 'JAVA??????',
      dataIndex: 'javaField',
      editable: true,
      width: '10%',
    },
    {
      title: '????????????',
      dataIndex: 'queryType',
      editable: true,
      width: '10%',
      render: (text) => queryType[text],
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.columnId)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </a>
          );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'queryType' ? 'Select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        rowKey="columnId"
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        size="small"
      />
    </Form>
  );
};

const EditTableForm = () => {
  const [data, setData] = useState({});
  const [submitting, setsubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [form] = Form.useForm();

  // ????????????????????????
  const queryData = async () => {
    const { tableId } = location.query;
    if (!tableId) {
      return;
    }

    setLoading(true);
    const { code, data: responData } = await queryById(tableId);
    if (code === 200) {
      // const roleResourceDos = responData.roleResourceDos.map((i) => `${i}`);
      // const tempresponData = { ...responData, roleResourceDos };
      setData(responData);
      form.setFieldsValue(responData.info);
    } else {
      message.error('????????????');
    }
    setLoading(false);
  };

  useEffect(() => {
    queryData();
    // queryMenu();
  }, []);

  const onFinish = async (values) => {
    message.loading({ content: '????????????', key, duration: 0 });
    setsubmitting(true);

    // ????????????
    const { code, msg } = await update({ ...data.info, ...values, columns: data.rows });

    if (code === 200) {
      message.success({ content: msg, key });
      setsubmitting(false);
      history.goBack();
    } else {
      message.error({ content: msg, key });
      setsubmitting(false);
    }

    // ????????????
  };

  const onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  return (
    <PageContainer
      onBack={() => {
        history.goBack();
      }}
      extra={[
        <Button
          key={0}
          type="primary"
          onClick={() => {
            form.submit();
          }}
          loading={submitting}
        >
          ??????
        </Button>,
      ]}
    >
      <Card title="????????????" loading={loading}>
        <Form
          style={{ marginTop: 8 }}
          form={form}
          name="sysdateCreate"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={24}>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="?????????"
                name="tableName"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              >
                <Input placeholder="?????????" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="?????????"
                name="tableComment"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              >
                <Input placeholder="?????????" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="???????????????"
                name="className"
                rules={[
                  {
                    required: true,
                    message: '???????????????????????????',
                  },
                ]}
              >
                <Input placeholder="?????????" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="??????"
                name="functionAuthor"
                rules={[
                  {
                    required: true,
                    message: '??????????????????',
                  },
                ]}
              >
                <Input placeholder="?????????" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="???????????????"
                name="packageName"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              >
                <Input placeholder="?????????" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="???????????????"
                name="moduleName"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              >
                <Input placeholder="?????????" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="???????????????"
                name="businessName"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              >
                <Input placeholder="?????????" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="??????????????? "
                name="functionName"
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                ]}
              >
                <Input placeholder="?????????" />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="????????????" loading={loading} style={{ marginTop: 20 }}>
        <EditableTable
          originData={data.rows}
          setOriginData={(newData) => {
            setData({ ...data, rows: newData });
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default EditTableForm;
