import {
  AntdList,
  Button,
  Card,
  Col,
  Create,
  Form,
  Icons,
  Input,
  Modal,
  Row,
  Select,
  useForm,
  useModal,
  useSimpleList,
} from "@pankod/refine-antd";

import { IPost } from "interfaces";
import { useTranslation } from "react-i18next";
import { HttpError, CrudFilters, useNavigation } from "@pankod/refine-core";
import { ICategory } from "../../interfaces/index";
import { useState, useEffect } from "react";

export const PostCreate = () => {
  const { formProps, saveButtonProps } = useForm<IPost, HttpError, IPost>({
    onMutationSuccess: () => setIsSaving(false),
    onMutationError: () => setIsSaving(false),
  });

  const [isSaving, setIsSaving] = useState(false);

  const { t } = useTranslation();

  return (
    <Create saveButtonProps={{ ...saveButtonProps, loading: isSaving }}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={async (values) => {
          setIsSaving(true);
          return formProps.onFinish && formProps.onFinish(values);
        }}
      >
        <Form.Item
          label={t("posts.fields.title")}
          name="title"
          rules={[{ required: true, message: "入力してください" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("posts.fields.status.title")}
          name="status"
          rules={[{ required: true, message: "入力してください" }]}
        >
          <Select
            options={[
              {
                label: "Published",
                value: "published",
              },
              {
                label: "Draft",
                value: "draft",
              },
              {
                label: "Rejected",
                value: "rejected",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={t("posts.fields.category.title")}
          name={["category", "id"]}
          rules={[{ required: true, message: "入力してください" }]}
        >
          <CategoryForm />
        </Form.Item>
      </Form>
    </Create>
  );
};

export type CategoryFormProps = {
  value?: number;
  onChange?: (value: number | undefined) => void;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({ value, onChange }) => {
  const { listProps, searchFormProps, queryResult } = useSimpleList<
    ICategory,
    HttpError,
    { title: string }
  >({
    resource: "categories",
    pagination: { pageSize: 5 },
    onSearch: ({ title }) => {
      const filters: CrudFilters = [];

      filters.push({
        field: "title",
        operator: "eq",
        value: title ? title : undefined,
      });

      return filters;
    },
  });

  const { data } = queryResult;

  const { modalProps, show, close } = useModal();

  const [selectCategory, setSelectCategory] = useState<number | undefined>(value);

  useEffect(() => onChange?.(selectCategory), [onChange, selectCategory]);

  return (
    <>
      <Row>
        <Col>{selectCategory && <>{data?.data.find((x) => x.id == selectCategory)?.title}</>}</Col>
        <Col>
          <Button onClick={() => show()} style={{ margin: 10 }}>
            選択する
          </Button>
        </Col>
      </Row>
      <Modal {...modalProps} footer={null} width={1000}>
        <Form {...searchFormProps} style={{ paddingTop: 50 }}>
          <Form.Item name="title">
            <Row justify="start" gutter={[64, 0]}>
              <Col lg={8} sm={24}>
                <Form.Item label="Title" name="title">
                  <Input allowClear prefix={<Icons.SearchOutlined />} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Col>
                <Form.Item>
                  <Button htmlType="submit">検索</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <AntdList
            {...listProps}
            grid={{ gutter: 3 }}
            dataSource={data?.data}
            renderItem={(category) => (
              <AntdList.Item style={{ display: "flex", justifyContent: "center" }}>
                <Card title={category.id} style={{ width: 180 }}>
                  <a
                    style={{ fontSize: 16 }}
                    onClick={() => {
                      setSelectCategory(category.id);
                      close();
                    }}
                  >
                    {category.title}
                  </a>
                </Card>
              </AntdList.Item>
            )}
          />
        </Form>
      </Modal>
    </>
  );
};
