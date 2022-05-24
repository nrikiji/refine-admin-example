import { CrudFilters, useMany, HttpError, getDefaultFilter, useGetLocale } from "@pankod/refine-core";
import {
  List,
  TextField,
  TagField,
  DateField,
  Table,
  useTable,
  FilterDropdown,
  Select,
  ShowButton,
  useSelect,
  Space,
  EditButton,
  DeleteButton,
  FormProps,
  Form,
  Row,
  Col,
  Input,
  Icons,
  Button,
} from "@pankod/refine-antd";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import { IPost, ICategory } from "interfaces";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

interface IPostFilterVariables {
  title?: string;
  status?: string;
  createdAt?: dayjs.Dayjs;
}

const statuses = ["published", "draft", "rejected"];

const Filter: React.FC<{ formProps: FormProps; filters: CrudFilters }> = (props) => {
  const { formProps, filters } = props;
  const { t } = useTranslation();

  const createdAt = useMemo(() => {
    const value = getDefaultFilter("createdAt", filters);
    return value ? dayjs(value) : null;
  }, [filters]);

  return (
    <Form
      {...formProps}
      initialValues={{
        title: getDefaultFilter("title", filters),
        status: getDefaultFilter("status", filters),
        createdAt: createdAt,
      }}
    >
      <Row justify="start" gutter={[64, 0]}>
        <Col lg={6} sm={24}>
          <Form.Item label={t("posts.fields.title")} name="title">
            <Input allowClear prefix={<Icons.SearchOutlined />} />
          </Form.Item>
        </Col>
        <Col lg={6} sm={24}>
          <Form.Item label={t("posts.fields.status.title")} name="status">
            <Select
              allowClear
              options={statuses.map((status) => {
                return { value: status, label: status };
              })}
              onChange={() => formProps.form?.submit()}
            ></Select>
          </Form.Item>
        </Col>
        <Col lg={6} sm={24}>
          <Form.Item label={t("posts.fields.createdAt")} name="createdAt">
            <DatePicker onChange={() => formProps.form?.submit()} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end">
        <Col>
          <Form.Item>
            <Button htmlType="submit">Search</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export const PostList: React.FC = () => {
  const { tableProps, searchFormProps, filters } = useTable<IPost, HttpError, IPostFilterVariables>({
    syncWithLocation: true,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { title, status, createdAt } = params;

      filters.push({
        field: "title",
        operator: "eq",
        value: title ? title : undefined,
      });

      filters.push({
        field: "status",
        operator: "eq",
        value: status ? status : undefined,
      });

      filters.push({
        field: "createdAt",
        operator: "eq",
        value: createdAt?.format("YYYY-MM-DD"),
      });

      return filters;
    },
  });

  const categoryIds = tableProps?.dataSource?.map((item) => item.category.id) ?? [];
  const { data: categoriesData, isLoading } = useMany<ICategory>({
    resource: "categories",
    ids: categoryIds,
    queryOptions: {
      enabled: categoryIds.length > 0,
    },
  });
  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const { t } = useTranslation();

  return (
    <List>
      <Filter formProps={searchFormProps} filters={filters || []} />
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title={t("posts.fields.title")} />
        <Table.Column
          dataIndex="status"
          title={t("posts.fields.status.title")}
          render={(value) => <TagField value={value} />}
        />
        <Table.Column
          dataIndex="createdAt"
          title={t("posts.fields.createdAt")}
          render={(value) => <DateField format="LLL" value={value} />}
        />
        <Table.Column
          dataIndex={["category", "id"]}
          title={t("posts.fields.category.title")}
          render={(value) => {
            if (isLoading) {
              return <TextField value="Loading..." />;
            }

            return <TextField value={categoriesData?.data.find((item) => item.id === value)?.title} />;
          }}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 200 }}
                mode="multiple"
                placeholder="Select Category"
                {...categorySelectProps}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column<IPost>
          title="Actions"
          dataIndex="actions"
          render={(_text, record): React.ReactNode => {
            return (
              <Space>
                <ShowButton size="small" recordItemId={record.id} hideText />
                <EditButton size="small" recordItemId={record.id} hideText />
                <DeleteButton size="small" recordItemId={record.id} hideText />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};
