import { useEffect } from "react";
import { HttpError, Refine, useGetLocale } from "@pankod/refine-core";
import {
  Layout,
  ReadyPage,
  notificationProvider,
  ErrorComponent,
  ConfigProvider,
} from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
import axios from "axios";
import { useTranslation } from "react-i18next";

import "@pankod/refine-antd/dist/styles.min.css";

import { PostList, PostShow, PostEdit, PostCreate } from "./pages/posts";
import { authProvider } from "authProvider";

import "dayjs/locale/ja";
import locale from "antd/lib/locale/ja_JP";

// initialize axios
const API_URL = "https://api.fake-rest.refine.dev";
export const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = API_URL;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

const App: React.FC = () => {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <ConfigProvider locale={locale}>
      <Refine
        routerProvider={routerProvider}
        i18nProvider={i18nProvider}
        authProvider={authProvider}
        dataProvider={dataProvider(API_URL, axiosInstance)}
        Layout={Layout}
        ReadyPage={ReadyPage}
        notificationProvider={notificationProvider}
        catchAll={<ErrorComponent />}
        resources={[
          {
            name: "posts",
            list: PostList,
            show: PostShow,
            edit: PostEdit,
            create: PostCreate,
            canDelete: true,
          },
        ]}
      />
    </ConfigProvider>
  );
};

export default App;
