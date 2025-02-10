/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  AccountType,
  InputMaybe,
  LegalEntity,
  LegalEntityId,
  Scalars,
} from "../../document-models/invoice";
import React, { useCallback, useState } from "react";
import { ComponentPropsWithRef, Ref, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type LegalEntityBasicInput = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  streetAddress?: InputMaybe<Scalars["String"]["input"]>;
  extendedAddress?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  stateProvince?: InputMaybe<Scalars["String"]["input"]>;
  postalCode?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  tel?: InputMaybe<Scalars["String"]["input"]>;
};

export type LegalEntityBankInput = {
  ABA?: InputMaybe<Scalars["String"]["input"]>;
  ABAIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  BIC?: InputMaybe<Scalars["String"]["input"]>;
  BICIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  SWIFT?: InputMaybe<Scalars["String"]["input"]>;
  SWIFTIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  accountNum?: InputMaybe<Scalars["String"]["input"]>;
  accountNumIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  accountType?: InputMaybe<AccountType | `${AccountType}`>;
  accountTypeIntermediary?: InputMaybe<AccountType | `${AccountType}`>;
  beneficiary?: InputMaybe<Scalars["String"]["input"]>;
  beneficiaryIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  city?: InputMaybe<Scalars["String"]["input"]>;
  cityIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  countryIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  extendedAddress?: InputMaybe<Scalars["String"]["input"]>;
  extendedAddressIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  memo?: InputMaybe<Scalars["String"]["input"]>;
  memoIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  nameIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  postalCode?: InputMaybe<Scalars["String"]["input"]>;
  postalCodeIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  stateProvince?: InputMaybe<Scalars["String"]["input"]>;
  stateProvinceIntermediary?: InputMaybe<Scalars["String"]["input"]>;
  streetAddress?: InputMaybe<Scalars["String"]["input"]>;
  streetAddressIntermediary?: InputMaybe<Scalars["String"]["input"]>;
};

export type LegalEntityWalletInput = {
  rpc: InputMaybe<Scalars["String"]["input"]>;
  chainName: InputMaybe<Scalars["String"]["input"]>;
  chainId: InputMaybe<Scalars["String"]["input"]>;
  address: InputMaybe<Scalars["String"]["input"]>;
};

const TextInput = forwardRef(function TextInput(
  props: ComponentPropsWithRef<"input">,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className={twMerge(
        "h-10 w-full rounded-md border border-gray-200 bg-white px-3 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:p-0",
        props.className,
      )}
      ref={ref}
      type="text"
    />
  );
});

const ACCOUNT_TYPES = ["CHECKING", "SAVINGS", "TRUST"];

const AccountTypeSelect = forwardRef(function AccountTypeSelect(
  props: ComponentPropsWithRef<"select">,
  ref: Ref<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className={twMerge(
        "h-10 w-full rounded-md border border-gray-200 bg-white px-3 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:p-0",
        props.className,
      )}
      ref={ref}
    >
      <option value="">Select Account Type</option>
      {ACCOUNT_TYPES.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
});

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-gray-700">{children}</label>
);

export type LegalEntityBasicInputProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  readonly value: LegalEntityBasicInput;
  readonly onChange: (value: LegalEntityBasicInput) => void;
  readonly disabled?: boolean;
};

export const LegalEntityBasicInput = forwardRef(function LegalEntityBasicInput(
  props: LegalEntityBasicInputProps,
  ref: Ref<HTMLDivElement>,
) {
  const { value, onChange, disabled, ...divProps } = props;

  const handleInputChange =
    (field: keyof LegalEntityBasicInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(field, e.target.value);

      onChange({
        ...value,
        id: field === "id" ? e.target.value : value.id, // Ensure `id` remains a string
        [field]: e.target.value,
      });
    };

  const normalizedId =
    typeof value.id === "string"
      ? value.id
      : ((value.id as any)?.taxId ?? (value.id as any)?.corpRegId ?? "");

  return (
    <div
      {...divProps}
      className={twMerge(
        "rounded-lg border border-gray-200 bg-white p-6",
        props.className,
      )}
      ref={ref}
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Basic Information
      </h3>
      <div className="space-y-6">
        <div className="space-y-2">
          <FieldLabel>Name</FieldLabel>
          <TextInput
            disabled={disabled}
            onChange={handleInputChange("name")}
            placeholder="Legal Entity Name"
            value={value.name ?? ""}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Tax ID / Corp. Reg</FieldLabel>
          <TextInput
            disabled={disabled}
            onChange={handleInputChange("id")}
            placeholder="123456789..."
            value={normalizedId}
          />
        </div>

        <div className="space-y-4">
          <FieldLabel>Address</FieldLabel>
          <div className="space-y-4">
            <TextInput
              disabled={disabled}
              onChange={handleInputChange("streetAddress")}
              placeholder="Street Address"
              value={value.streetAddress ?? ""}
            />
            <TextInput
              disabled={disabled}
              onChange={handleInputChange("extendedAddress")}
              placeholder="Extended Address"
              value={value.extendedAddress ?? ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FieldLabel>City</FieldLabel>
              <TextInput
                disabled={disabled}
                onChange={handleInputChange("city")}
                placeholder="City"
                value={value.city ?? ""}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>State/Province</FieldLabel>
              <TextInput
                disabled={disabled}
                onChange={handleInputChange("stateProvince")}
                placeholder="State/Province"
                value={value.stateProvince ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FieldLabel>Postal Code</FieldLabel>
              <TextInput
                disabled={disabled}
                onChange={handleInputChange("postalCode")}
                placeholder="Postal Code"
                value={value.postalCode ?? ""}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Country</FieldLabel>
              <TextInput
                disabled={disabled}
                onChange={handleInputChange("country")}
                placeholder="Country"
                value={value.country ?? ""}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FieldLabel>Email</FieldLabel>
            <TextInput
              disabled={disabled}
              onChange={handleInputChange("email")}
              placeholder="Email"
              type="email"
              value={value.email ?? ""}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Telephone</FieldLabel>
            <TextInput
              disabled={disabled}
              onChange={handleInputChange("tel")}
              placeholder="Telephone"
              type="tel"
              value={value.tel ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export type LegalEntityBankInputProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  readonly value: LegalEntityBankInput;
  readonly onChange: (value: LegalEntityBankInput) => void;
  readonly disabled?: boolean;
};

export const LegalEntityBankInput = forwardRef(function LegalEntityBankInput(
  props: LegalEntityBankInputProps,
  ref: Ref<HTMLDivElement>,
) {
  const { value, onChange, disabled, ...divProps } = props;
  const [showIntermediary, setShowIntermediary] = useState(false);

  const handleInputChange = useCallback(
    function handleInputChange(
      field: keyof LegalEntityBankInput,
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) {
      onChange({
        ...value,
        [field]: event.target.value,
      });
    },
    [onChange, value],
  );

  const handleIntermediaryToggle = useCallback(
    function handleIntermediaryToggle(
      event: React.ChangeEvent<HTMLInputElement>,
    ) {
      setShowIntermediary(event.target.checked);
    },
    [],
  );

  function createInputHandler(field: keyof LegalEntityBankInput) {
    return function handleFieldChange(
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) {
      handleInputChange(field, event);
    };
  }

  return (
    <div
      {...divProps}
      className={twMerge(
        "rounded-lg border border-gray-200 bg-white p-6",
        props.className,
      )}
      ref={ref}
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Banking Information
      </h3>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel>Account Number</FieldLabel>
            <TextInput
              disabled={disabled}
              onChange={createInputHandler("accountNum")}
              placeholder="Account Number"
              value={value.accountNum ?? ""}
            />
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel>Account Details</FieldLabel>
                <AccountTypeSelect
                  disabled={disabled}
                  onChange={createInputHandler("accountType")}
                  value={value.accountType ?? ""}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>ABA/BIC/SWIFT No.</FieldLabel>

                <TextInput
                  disabled={disabled}
                  onChange={createInputHandler("BIC")}
                  placeholder="ABA/BIC/SWIFT No."
                  value={(value.ABA || value.BIC || value.SWIFT) ?? ""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <FieldLabel>Beneficiary Information</FieldLabel>
          <TextInput
            disabled={disabled}
            onChange={createInputHandler("beneficiary")}
            placeholder="Beneficiary Name"
            value={value.beneficiary ?? ""}
          />
        </div>

        <div className="space-y-4">
          <FieldLabel>Bank Details</FieldLabel>
          <TextInput
            disabled={disabled}
            onChange={createInputHandler("name")}
            placeholder="Bank Name"
            value={value.name ?? ""}
          />
        </div>

        <div className="space-y-4">
          <FieldLabel>Bank Address</FieldLabel>
          <div className="space-y-4 rounded-lg bg-gray-50 p-4">
            <TextInput
              disabled={disabled}
              onChange={createInputHandler("streetAddress")}
              placeholder="Street Address"
              value={value.streetAddress ?? ""}
            />
            <TextInput
              disabled={disabled}
              onChange={createInputHandler("extendedAddress")}
              placeholder="Extended Address"
              value={value.extendedAddress ?? ""}
            />
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                disabled={disabled}
                onChange={createInputHandler("city")}
                placeholder="City"
                value={value.city ?? ""}
              />
              <TextInput
                disabled={disabled}
                onChange={createInputHandler("stateProvince")}
                placeholder="State/Province"
                value={value.stateProvince ?? ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                disabled={disabled}
                onChange={createInputHandler("postalCode")}
                placeholder="Postal Code"
                value={value.postalCode ?? ""}
              />
              <TextInput
                disabled={disabled}
                onChange={createInputHandler("country")}
                placeholder="Country"
                value={value.country ?? ""}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Memo</FieldLabel>
          <TextInput
            disabled={disabled}
            onChange={createInputHandler("memo")}
            placeholder="Memo"
            value={value.memo ?? ""}
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <label className="flex items-center space-x-2">
            <input
              checked={showIntermediary}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              id="showIntermediary"
              onChange={handleIntermediaryToggle}
              type="checkbox"
            />
            <span className="text-sm font-medium text-gray-700">
              Include Intermediary Bank
            </span>
          </label>
        </div>

        {showIntermediary ? (
          <div className="bg-blue-50 mt-4 space-y-6 rounded-lg border border-blue-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Intermediary Bank Details
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <TextInput
                    disabled={disabled}
                    onChange={createInputHandler("accountNumIntermediary")}
                    placeholder="Intermediary Account Number"
                    value={value.accountNumIntermediary ?? ""}
                  />
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldLabel>Account Details</FieldLabel>
                      <AccountTypeSelect
                        disabled={disabled}
                        onChange={createInputHandler("accountTypeIntermediary")}
                        value={value.accountTypeIntermediary ?? ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel>ABA/BIC/SWIFT No.</FieldLabel>

                      <TextInput
                        disabled={disabled}
                        onChange={createInputHandler("BICIntermediary")}
                        placeholder="ABA/BIC/SWIFT No."
                        value={
                          (value.ABAIntermediary ||
                            value.BICIntermediary ||
                            value.SWIFTIntermediary) ??
                          ""
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Beneficiary Information
                </label>
                <TextInput
                  disabled={disabled}
                  onChange={createInputHandler("beneficiaryIntermediary")}
                  placeholder="Intermediary Beneficiary Name"
                  value={value.beneficiaryIntermediary ?? ""}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bank Details
                </label>
                <TextInput
                  disabled={disabled}
                  onChange={createInputHandler("nameIntermediary")}
                  placeholder="Intermediary Bank Name"
                  value={value.nameIntermediary ?? ""}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bank Address
                </label>
                <div className="space-y-4 rounded-lg bg-gray-100 p-4">
                  <TextInput
                    disabled={disabled}
                    onChange={createInputHandler("streetAddressIntermediary")}
                    placeholder="Street Address"
                    value={value.streetAddressIntermediary ?? ""}
                  />
                  <TextInput
                    disabled={disabled}
                    onChange={createInputHandler("extendedAddressIntermediary")}
                    placeholder="Extended Address"
                    value={value.extendedAddressIntermediary ?? ""}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      disabled={disabled}
                      onChange={createInputHandler("cityIntermediary")}
                      placeholder="City"
                      value={value.cityIntermediary ?? ""}
                    />
                    <TextInput
                      disabled={disabled}
                      onChange={createInputHandler("stateProvinceIntermediary")}
                      placeholder="State/Province"
                      value={value.stateProvinceIntermediary ?? ""}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      disabled={disabled}
                      onChange={createInputHandler("postalCodeIntermediary")}
                      placeholder="Postal Code"
                      value={value.postalCodeIntermediary ?? ""}
                    />
                    <TextInput
                      disabled={disabled}
                      onChange={createInputHandler("countryIntermediary")}
                      placeholder="Country"
                      value={value.countryIntermediary ?? ""}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Memo
                </label>
                <TextInput
                  disabled={disabled}
                  onChange={createInputHandler("memoIntermediary")}
                  placeholder="Memo"
                  value={value.memoIntermediary ?? ""}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export type LegalEntityWalletInputProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "onChange"
> & {
  readonly value: LegalEntityWalletInput;
  readonly onChange: (value: LegalEntityWalletInput) => void;
  readonly disabled?: boolean;
};

export const LegalEntityWalletInput = forwardRef(
  function LegalEntityWalletInput(
    props: LegalEntityWalletInputProps,
    ref: Ref<HTMLDivElement>,
  ) {
    const { value, onChange, disabled, ...divProps } = props;

    const handleInputChange = useCallback(
      function handleInputChange(
        field: keyof LegalEntityWalletInput,
        event: React.ChangeEvent<HTMLInputElement>,
      ) {
        onChange({
          ...value,
          [field]: event.target.value,
        });
      },
      [onChange, value],
    );

    function createInputHandler(field: keyof LegalEntityWalletInput) {
      return function handleFieldChange(
        event: React.ChangeEvent<HTMLInputElement>,
      ) {
        handleInputChange(field, event);
      };
    }

    return (
      <div
        {...divProps}
        className={twMerge(
          "rounded-lg border border-gray-200 bg-white p-6",
          props.className,
        )}
        ref={ref}
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Wallet Information
        </h3>
        <div className="space-y-6">
          <div className="space-y-4">
            {/* <div className="space-y-2">
            <FieldLabel>RPC Endpoint</FieldLabel>
            <TextInput
              disabled={disabled}
              onChange={createInputHandler("rpc")}
              placeholder="RPC Endpoint URL"
              value={value.rpc ?? ""}
            />
          </div> */}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel>Chain Name</FieldLabel>
                <TextInput
                  disabled={disabled}
                  onChange={createInputHandler("chainName")}
                  placeholder="Chain Name"
                  value={value.chainName ?? ""}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Chain ID</FieldLabel>
                <TextInput
                  disabled={disabled}
                  onChange={createInputHandler("chainId")}
                  placeholder="Chain ID"
                  value={value.chainId ?? ""}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <FieldLabel>Wallet Address</FieldLabel>
            <TextInput
              disabled={disabled}
              onChange={createInputHandler("address")}
              placeholder="0x..."
              value={value.address ?? ""}
            />
          </div>
        </div>
      </div>
    );
  },
);

type LegalEntityFormProps = {
  readonly legalEntity: LegalEntity;
  readonly onChangeInfo?: (info: LegalEntityBasicInput) => void;
  readonly onChangeBank?: (bank: LegalEntityBankInput) => void;
  readonly onChangeWallet?: (wallet: LegalEntityWalletInput) => void;
  readonly basicInfoDisabled?: boolean;
  readonly bankDisabled?: boolean;
  readonly walletDisabled?: boolean;
};

export function LegalEntityForm({
  legalEntity,
  onChangeInfo,
  onChangeBank,
  onChangeWallet,
  basicInfoDisabled,
  bankDisabled,
  walletDisabled,
}: LegalEntityFormProps) {
  const basicInfo: LegalEntityBasicInput = {
    name: legalEntity.name ?? null,
    id:
      (legalEntity.id as any)?.taxId ??
      (legalEntity.id as any)?.corpRegId ??
      null,
    streetAddress: legalEntity.address?.streetAddress ?? null,
    extendedAddress: legalEntity.address?.extendedAddress ?? null,
    city: legalEntity.address?.city ?? null,
    stateProvince: legalEntity.address?.stateProvince ?? null,
    postalCode: legalEntity.address?.postalCode ?? null,
    country: legalEntity.country ?? null,
    email: legalEntity.contactInfo?.email ?? null,
    tel: legalEntity.contactInfo?.tel ?? null,
  };

  const bankInfo: LegalEntityBankInput = {
    accountNum: legalEntity.paymentRouting?.bank?.accountNum ?? null,
    accountNumIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.accountNum ?? null,
    beneficiary: legalEntity.paymentRouting?.bank?.beneficiary ?? null,
    beneficiaryIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.beneficiary ?? null,
    SWIFT: legalEntity.paymentRouting?.bank?.SWIFT ?? null,
    SWIFTIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.SWIFT ?? null,
    BIC: legalEntity.paymentRouting?.bank?.BIC ?? null,
    BICIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.BIC ?? null,
    ABA: legalEntity.paymentRouting?.bank?.ABA ?? null,
    ABAIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.ABA ?? null,
    accountType: legalEntity.paymentRouting?.bank?.accountType ?? null,
    accountTypeIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.accountType ?? null,
    city: legalEntity.paymentRouting?.bank?.address.city ?? null,
    cityIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.address.city ?? null,
    country: legalEntity.paymentRouting?.bank?.address.country ?? null,
    countryIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.address.country ??
      null,
    extendedAddress:
      legalEntity.paymentRouting?.bank?.address.extendedAddress ?? null,
    extendedAddressIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.address
        .extendedAddress ?? null,
    postalCode: legalEntity.paymentRouting?.bank?.address.postalCode ?? null,
    postalCodeIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.address.postalCode ??
      null,
    stateProvince:
      legalEntity.paymentRouting?.bank?.address.stateProvince ?? null,
    stateProvinceIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.address
        .stateProvince ?? null,
    streetAddress:
      legalEntity.paymentRouting?.bank?.address.streetAddress ?? null,
    streetAddressIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.address
        .streetAddress ?? null,
    memo: legalEntity.paymentRouting?.bank?.memo ?? null,
    memoIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.memo ?? null,
    name: legalEntity.paymentRouting?.bank?.name ?? null,
    nameIntermediary:
      legalEntity.paymentRouting?.bank?.intermediaryBank?.name ?? null,
  };

  const walletInfo: LegalEntityWalletInput = {
    rpc: legalEntity.paymentRouting?.wallet?.rpc || null,
    chainName: legalEntity.paymentRouting?.wallet?.chainName || null,
    chainId: legalEntity.paymentRouting?.wallet?.chainId || null,
    address: legalEntity.paymentRouting?.wallet?.address || null,
  };

  return (
    <div className="space-y-8">
      {!basicInfoDisabled && !!onChangeInfo && (
        <LegalEntityBasicInput onChange={onChangeInfo} value={basicInfo} />
      )}
      {!walletDisabled && !!onChangeWallet && (
        <LegalEntityWalletInput onChange={onChangeWallet} value={walletInfo} />
      )}
      {!bankDisabled && !!onChangeBank && (
        <LegalEntityBankInput onChange={onChangeBank} value={bankInfo} />
      )}
    </div>
  );
}
