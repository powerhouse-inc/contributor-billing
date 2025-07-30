import type { EditorProps } from "document-model";
import {
  type IntegrationsDocument,
  actions,
} from "../../document-models/integrations/index.js";
import { Button } from "@powerhousedao/document-engineering";
import React, { useState } from "react";

export type IProps = EditorProps<IntegrationsDocument>;

const TABS = [
  { key: "requestFinance", label: "Request Finance" },
  { key: "gnosisSafe", label: "Gnosis Safe" },
  { key: "googleCloud", label: "Google Cloud" },
];

export default function Editor(props: IProps) {
  const { document, dispatch } = props;
  const [activeTab, setActiveTab] = useState("requestFinance");

  // State for each form
  const [requestFinance, setRequestFinance] = useState(() => ({
    apiKey: document.state.global.requestFinance?.apiKey || "",
    email: document.state.global.requestFinance?.email || "",
  }));
  const [gnosisSafe, setGnosisSafe] = useState(() => ({
    safeAddress: document.state.global.gnosisSafe?.safeAddress || "",
    signerPrivateKey: document.state.global.gnosisSafe?.signerPrivateKey || "",
  }));
  const [googleCloud, setGoogleCloud] = useState(() => ({
    projectId: document.state.global.googleCloud?.projectId || "",
    location: document.state.global.googleCloud?.location || "",
    processorId: document.state.global.googleCloud?.processorId || "",
    keyFile: {
      type: document.state.global.googleCloud?.keyFile?.type || "",
      project_id: document.state.global.googleCloud?.keyFile?.project_id || "",
      private_key_id:
        document.state.global.googleCloud?.keyFile?.private_key_id || "",
      private_key:
        document.state.global.googleCloud?.keyFile?.private_key || "",
      client_email:
        document.state.global.googleCloud?.keyFile?.client_email || "",
      client_id: document.state.global.googleCloud?.keyFile?.client_id || "",
      auth_uri: document.state.global.googleCloud?.keyFile?.auth_uri || "",
      token_uri: document.state.global.googleCloud?.keyFile?.token_uri || "",
      auth_provider_x509_cert_url:
        document.state.global.googleCloud?.keyFile
          ?.auth_provider_x509_cert_url || "",
      client_x509_cert_url:
        document.state.global.googleCloud?.keyFile?.client_x509_cert_url || "",
      universe_domain:
        document.state.global.googleCloud?.keyFile?.universe_domain || "",
    },
  }));

  // Handlers
  const handleRequestFinanceSave = () => {
    dispatch(actions.setRequestFinance(requestFinance));
  };
  const handleGnosisSafeSave = () => {
    dispatch(actions.setGnosisSafe(gnosisSafe));
  };
  const handleGoogleCloudSave = () => {
    dispatch(
      actions.setGoogleCloud({
        ...googleCloud,
        keyFile: { ...googleCloud.keyFile },
      })
    );
  };

  return (
    <div className="editor-container min-h-screen bg-gray-50 flex flex-col items-center p-2 sm:p-4">
      <div className="w-full max-w-xl">
        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 py-2 text-sm sm:text-base font-medium transition-colors duration-200 border-b-2 focus:outline-none ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600 bg-white"
                  : "border-transparent text-gray-500 bg-gray-100 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          {activeTab === "requestFinance" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleRequestFinanceSave();
              }}
            >
              <h2 className="text-lg font-semibold mb-2">
                Request Finance API
              </h2>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">API Key</span>
                <input
                  className="input input-bordered rounded px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 text-sm"
                  type="text"
                  value={requestFinance.apiKey}
                  onChange={(e) =>
                    setRequestFinance((v) => ({ ...v, apiKey: e.target.value }))
                  }
                  placeholder="Enter API Key"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Email</span>
                <input
                  className="input input-bordered rounded px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 text-sm"
                  type="email"
                  value={requestFinance.email}
                  onChange={(e) =>
                    setRequestFinance((v) => ({ ...v, email: e.target.value }))
                  }
                  placeholder="Enter Email"
                />
              </label>
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  color="black"
                  type="submit"
                  className="hover:bg-gray-200"
                  disabled={
                    document.state.global.requestFinance?.apiKey ===
                      requestFinance.apiKey &&
                    document.state.global.requestFinance?.email ===
                      requestFinance.email
                  }
                >
                  Save
                </Button>
              </div>
            </form>
          )}

          {activeTab === "gnosisSafe" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleGnosisSafeSave();
              }}
            >
              <h2 className="text-lg font-semibold mb-2">Gnosis Safe</h2>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Safe Address</span>
                <input
                  className="input input-bordered rounded px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 text-sm"
                  type="text"
                  value={gnosisSafe.safeAddress}
                  onChange={(e) =>
                    setGnosisSafe((v) => ({
                      ...v,
                      safeAddress: e.target.value,
                    }))
                  }
                  placeholder="0x..."
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Signer Private Key</span>
                <input
                  className="input input-bordered rounded px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 text-sm"
                  type="text"
                  value={gnosisSafe.signerPrivateKey}
                  onChange={(e) =>
                    setGnosisSafe((v) => ({
                      ...v,
                      signerPrivateKey: e.target.value,
                    }))
                  }
                  placeholder="Private Key"
                />
              </label>
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  color="black"
                  type="submit"
                  className="hover:bg-gray-200"
                  disabled={
                    document.state.global.gnosisSafe?.safeAddress ===
                      gnosisSafe.safeAddress &&
                    document.state.global.gnosisSafe?.signerPrivateKey ===
                      gnosisSafe.signerPrivateKey
                  }
                >
                  Save
                </Button>
              </div>
            </form>
          )}

          {activeTab === "googleCloud" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleGoogleCloudSave();
              }}
            >
              <h2 className="text-lg font-semibold mb-2">Google Cloud</h2>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Project ID</span>
                <input
                  className="input input-bordered rounded px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 text-sm"
                  type="text"
                  value={googleCloud.projectId}
                  onChange={(e) =>
                    setGoogleCloud((v) => ({ ...v, projectId: e.target.value }))
                  }
                  placeholder="Project ID"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Location</span>
                <input
                  className="input input-bordered rounded px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 text-sm"
                  type="text"
                  value={googleCloud.location}
                  onChange={(e) =>
                    setGoogleCloud((v) => ({ ...v, location: e.target.value }))
                  }
                  placeholder="Location"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Processor ID</span>
                <input
                  className="input input-bordered rounded px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 text-sm"
                  type="text"
                  value={googleCloud.processorId}
                  onChange={(e) =>
                    setGoogleCloud((v) => ({
                      ...v,
                      processorId: e.target.value,
                    }))
                  }
                  placeholder="Processor ID"
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(googleCloud.keyFile).map(([key, value]) => (
                  <label className="flex flex-col gap-1" key={key}>
                    <span className="text-sm font-medium">
                      {key.replace(/_/g, " ")}
                    </span>
                    <input
                      className="input input-bordered rounded px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 text-sm"
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setGoogleCloud((v) => ({
                          ...v,
                          keyFile: { ...v.keyFile, [key]: e.target.value },
                        }))
                      }
                      placeholder={key.replace(/_/g, " ")}
                    />
                  </label>
                ))}
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  color="black"
                  type="submit"
                  className="hover:bg-gray-200"
                  disabled={
                    document.state.global.googleCloud?.projectId ===
                      googleCloud.projectId &&
                    document.state.global.googleCloud?.location ===
                      googleCloud.location &&
                    document.state.global.googleCloud?.processorId ===
                      googleCloud.processorId &&
                    document.state.global.googleCloud?.keyFile?.type ===
                      googleCloud.keyFile.type &&
                    document.state.global.googleCloud?.keyFile?.project_id ===
                      googleCloud.keyFile.project_id &&
                    document.state.global.googleCloud?.keyFile
                      ?.private_key_id === googleCloud.keyFile.private_key_id &&
                    document.state.global.googleCloud?.keyFile?.private_key ===
                      googleCloud.keyFile.private_key &&
                    document.state.global.googleCloud?.keyFile?.client_email ===
                      googleCloud.keyFile.client_email &&
                    document.state.global.googleCloud?.keyFile?.client_id ===
                      googleCloud.keyFile.client_id &&
                    document.state.global.googleCloud?.keyFile?.auth_uri ===
                      googleCloud.keyFile.auth_uri &&
                    document.state.global.googleCloud?.keyFile?.token_uri ===
                      googleCloud.keyFile.token_uri &&
                    document.state.global.googleCloud?.keyFile
                      ?.auth_provider_x509_cert_url ===
                      googleCloud.keyFile.auth_provider_x509_cert_url &&
                    document.state.global.googleCloud?.keyFile
                      ?.client_x509_cert_url ===
                      googleCloud.keyFile.client_x509_cert_url &&
                    document.state.global.googleCloud?.keyFile
                      ?.universe_domain === googleCloud.keyFile.universe_domain
                  }
                >
                  Save
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
