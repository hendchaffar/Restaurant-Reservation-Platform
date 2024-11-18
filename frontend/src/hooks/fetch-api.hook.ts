import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useMemo, useContext } from "react";
import { api } from "../utils/interceptor";
import { toast } from "react-toastify";
import { useLoading } from "../context/loader.context";

type Method = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

export const useAxios = (
  url: string,
  method: Method | "",
  payload: any,
  name = "data",
  visibility = true,
  params?: any
) => {
  const {hideLoader,showLoader}=useLoading()
  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [refresh, setRefresh] = useState<any>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const controllerRef = useRef(new AbortController());
  const baseUrl = `${process.env.API_URL}/api/`;
  const cancel = () => {
    controllerRef.current.abort();
  };

  const fetchData = async () => {
    if (!payload && method) {
      return;
    }
    try {
      setError(null);
      setLoaded(true);
      showLoader();

      const response = await api.request({
        data: payload,
        signal: controllerRef.current.signal,
        method,
        url: `${baseUrl}${url}`,
        params: params,
      });
      setResponseData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoaded(false);
      hideLoader();
    }
  };

  useEffect(() => {
    if (visibility) {
      fetchData();
    }
  }, [visibility]);

  useEffect(() => {
    if (refresh > 0) {
      fetchData();
    }
  }, [refresh]);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  const submitRequest = async (
    payload: any,
    apiUrl?: string,
    toaster?: boolean
  ) => {
    try {
      setError(null);
      setLoaded(true);
      showLoader();

      const response = await api.request({
        data: payload,
        method,
        url: `${baseUrl}${apiUrl ? apiUrl : url}`,
        params: params,
      });
      setResponseData(response.data);
      const msg = {
        POST: "created",
        PUT: "updated",
        DELETE: "deleted",
        PATCH: "updated",
      };
      if (toaster) {
        //@ts-ignore
        toast.success(`item ${msg[method]} successfully`);
      }
    } catch (error:any) {
      setError(error);
      toast.error(`${error!.response.data.message}`);
    } finally {
      setLoaded(false);
      hideLoader();
    }
  };

  return {
    [name]: {
      responseData,
      error,
      loaded,
      submitRequest,
      refreshData,
      cancel,
    },
  };
};

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(
    () => new URLSearchParams(decodeURIComponent(search)),
    [search]
  );
};
