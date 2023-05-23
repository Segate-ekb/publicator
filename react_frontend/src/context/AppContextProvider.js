import React, { useReducer, useEffect, useState  } from "react";
import AppContext from "./AppContext";
import * as ApiProcessor from "../ApiProcessor"
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";

const AppContextProvider = ({ children }) => {
  const initialState = {
    bases: [],
    selectedBaseId: null,
    settings: {},
    crs: []
  };

  const [baseUpdated, setBaseUpdated] = useState(false);
  const [crsUpdated, setCrsUpdated] = useState(false);
  const [settingsUpdated, setSettingsUpdated] = useState(false);

  function appReducer(state, action) {
    switch (action.type) {
      case "ADD_BASES":
        return { ...state, bases: action.payload };
      case "ADD_BASE":
        return { ...state, bases: [...state.bases, action.payload] };
      case "UPDATE_BASE":
        return {
          ...state,
          bases: updateItem(state.bases, action.payload.id, () => action.payload),
        };
      case 'DELETE_BASE':
        return {
          ...state,
          bases: state.bases.filter(base => base.id !== action.payload),
        };
      case "UPDATE_PUBLICATION":
        const { publicationId, updatedPublication } = action.payload;
        return {
          ...state,
          bases: updateItem(
            state.bases,
            state.selectedBaseId,
            (base) => ({
              ...base,
              publications: updateItem(
                [...base.publications],
                publicationId,
                () => updatedPublication
              ),
            }),
            "id"
          ),
        };
      case "ADD_PUBLICATION":
        const { newPublication } = action.payload;
        return {
          ...state,
          bases: updateItem(
            state.bases,
            state.selectedBaseId,
            (base) => ({
              ...base,
              publications: [...base.publications, newPublication],
            }),
            "id"
          ),
        };
      case "DELETE_PUBLICATION":
        const deletedPublicationId = action.payload;

        return {
          ...state,
          bases: updateItem
            (state.bases, state.selectedBaseId, (base) => {
              console.log(base.publications);
              console.log(deletedPublicationId);
              const newPublications = base.publications.filter((publication) => publication.id !== deletedPublicationId);
              console.log(newPublications);
              return { ...base, publications: newPublications };
            }, "id"),
        };
      case "SET_SELECTED_BASE_ID":
        return { ...state, selectedBaseId: action.payload };
      case "UPDATE_SETTINGS":
        return { ...state, settings: action.payload };
      case "ADD_SERVERS":
        return { ...state, crs: action.payload };    
      case "ADD_SERVER":
        return { ...state, crs: [...state.crs, action.payload] };
      case "UPDATE_SERVER":
        return {
          ...state,
        crs: updateItem(state.crs, action.payload.id, () => action.payload),
        };
      case 'DELETE_SERVER':
      return {
          ...state,
          crs: state.crs.filter(server => server.id !== action.payload),
        };    
      default:
        return state;
    }
  }

  const updateItem = (items, targetId, callback, idFieldName = "id") =>
    items.map((item) =>
      item[idFieldName] === targetId ? callback(item) : item
    );

  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      const configData = await ApiProcessor.getConfig(showSnackbar);
      if (configData) {
        if (!configData.crs || configData.crs.length === 0) {
          configData.crs = [{
            id:  uuidv4(),
            name: "repository",
            active: false,
            title: "Репозиторий по умолчанию",
            tcpAddress: "tcp://localhost"
          }];
        }
    
        addBases(configData.bases);
        addCrs(configData.crs);
    }

      const settingsData = await ApiProcessor.getSettings(showSnackbar);
      if (settingsData) {
        loadSettings(settingsData);
      }
    };

    fetchData();
  }, []);
  

  useEffect(() => {
    const updateBases = async () => {
      await ApiProcessor.updateConfig(state.bases, state.crs, showSnackbar);
      setBaseUpdated(false);
    };
  
    if (baseUpdated) {
      updateBases();
    }
  }, [state.bases, baseUpdated]);

  useEffect(() => {
    const updateCrs = async () => {
      await ApiProcessor.updateConfig(state.bases, state.crs, showSnackbar);
      setCrsUpdated(false);
    };
  
    if (crsUpdated) {
      updateCrs();
    }
  }, [state.crs, crsUpdated]);

  useEffect(() => {
    const saveSettings = async () => {
      if (state.settings && Object.keys(state.settings).length > 0) {
        await ApiProcessor.updateSettings(state.settings, showSnackbar);
        setSettingsUpdated(false);
      }
    };
    if (settingsUpdated) {
      saveSettings();
    }
  }, [state.settings, settingsUpdated]);


  const addBases = (newBases) => {
    dispatch({ type: "ADD_BASES", payload: newBases });
  };

  const addBase = (newBase) => {
    const payload = {
      id: uuidv4(),
      name: newBase.name,
      srvr: newBase.srvr,
      ref: newBase.ref,
      publications: [
        {
          id: uuidv4(),
          name: newBase.ref,
          title: newBase.name,
          enable: true,
          active: false,
          usr: "",
          pwd: "",
          enableStandardOData: false,
          ws: {
            publishExtensionsByDefault: true,
            wsList: []
          },
          httpServices: {
            publishExtensionsByDefault: true,
            publishByDefault: true,
            hsList: []
          }
        }
      ],
    };
    dispatch({
      type: "ADD_BASE",
      payload: payload,
    });
    setBaseUpdated(true);
    setSelectedBaseId(payload.id);
  };

  const updateBase = (updatedBase) => {
    dispatch({ type: "UPDATE_BASE", payload: updatedBase });
    setBaseUpdated(true);
  };


  const deleteBase = (deletedBase) => {
    dispatch({ type: 'DELETE_BASE', payload: deletedBase.id });
    setBaseUpdated(true);
  };

  const addCrs = (newServers) => {
    dispatch({ type: "ADD_SERVERS", payload: newServers });
  };

  const addServer = (newServer) => {
    const payload = {
      id: uuidv4(),
      name: newServer.name,
      active: newServer.active,
      title: newServer.title,
      tcpAddress: newServer.tcpAddress
    };
    dispatch({
      type: "ADD_SERVER",
      payload: payload,
    });
    setCrsUpdated(true);
  };
  
  const updateServer = (updatedServer) => {
    dispatch({ type: "UPDATE_SERVER", payload: updatedServer });
    setCrsUpdated(true);
  };
  
  const deleteServer = (deletedServer) => {
    dispatch({ type: 'DELETE_SERVER', payload: deletedServer.id });
    setCrsUpdated(true);
  };

  const updatePublication = (publicationId, updatedPublication) => {
    dispatch({
      type: "UPDATE_PUBLICATION",
      payload: { publicationId, updatedPublication },
    });
    setBaseUpdated(true);
  };

  const addPublication = (newPublication) => {
    const publicationWithId = {
      ...newPublication,
      id: uuidv4(),
    };

    dispatch({
      type: "ADD_PUBLICATION",
      payload: { newPublication: publicationWithId },
    });
    setBaseUpdated(true);
  };

  const deletePublication = (deletedPublication) => {
    const deletedPublicationId = deletedPublication.id;
    dispatch({ type: 'DELETE_PUBLICATION', payload: deletedPublicationId });
    setBaseUpdated(true);
  };

  const setSelectedBaseId = (id) => {
    dispatch({ type: "SET_SELECTED_BASE_ID", payload: id });
  };

  const getUniqueTitles = () => {
    const selectedBase = state.bases.find(base => base.id === state.selectedBaseId);
    if (!selectedBase) return [];
    const titles = selectedBase.publications.map(publication => publication.title);
    return [...new Set(titles)];
  };

  const getUniqueEndpoints = () => {
    const allPublications = state.bases.flatMap(base => base.publications);
    const endpoints = allPublications.map(publication => publication.name);
    return [...new Set(endpoints)];
  };

  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message, variant = "default") => {
    enqueueSnackbar(message, {
      variant: variant,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  };

  const updateSettings = (newSettings) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: newSettings });
    setSettingsUpdated(true);
  };

  const loadSettings = (newSettings) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: newSettings });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addBases,
        addBase,
        updateBase,
        deleteBase,
        updatePublication,
        addPublication,
        showSnackbar,
        setSelectedBaseId,
        getUniqueTitles,
        getUniqueEndpoints,
        deletePublication,
        updateSettings,
        addServer, 
        updateServer,
        deleteServer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;