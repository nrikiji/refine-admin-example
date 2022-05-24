import { useForm, Form, Input, Select, Edit, useSelect } from "@pankod/refine-antd";
import { IPost } from "interfaces";
import { useTranslation } from "react-i18next";

export const PostEdit: React.FC = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<IPost>();

  const { selectProps: categorySelectProps } = useSelect<IPost>({
    resource: "categories",
    defaultValue: queryResult?.data?.data?.category.id,
  });

  const { t } = useTranslation();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label={t("posts.fields.title")} name="title">
          <Input />
        </Form.Item>
        <Form.Item label={t("posts.fields.status.title")} name="status">
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
        <Form.Item label={t("posts.fields.category.title")} name={["category", "id"]}>
          <Select {...categorySelectProps} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
