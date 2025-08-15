import { useState } from "react";
import { Tag } from "lucide-react";
import { ObjectSetTable, Select } from "@powerhousedao/document-engineering";
import { useMemo, useRef, useEffect } from "react";
import type {
  ObjectSetTableConfig,
  ColumnDef,
} from "@powerhousedao/document-engineering";
import {
  type BillingStatementDocument,
  actions,
} from "../../../document-models/billing-statement/index.js";

interface CellContext<T> {
  row: T; // Current row data
  column: ColumnDef<T>; // Column definition
  rowIndex: number; // Row position
  columnIndex: number; // Column position
  tableConfig: ObjectSetTableConfig<T>; // Full table configuration
}

const ObjectSetTableComponent = (props: { state: any; dispatch: any }) => {
  const { state, dispatch } = props;

  // console.log("lineItems", state.lineItems);

  const units = [
    { label: "Minute", value: "Minute" },
    { label: "Hour", value: "Hour" },
    { label: "Day", value: "Day" },
    { label: "Unit", value: "Unit" },
  ];

  const columns = useMemo(
    () => [
      {
        field: "description",
        title: "Description",
        editable: true,
        type: "text",
        onSave: (newValue: any, context: CellContext<any>) => {
          console.log({ newValue, context });
          console.log("id", context.row.id);
          // dispatch(actions.editLineItem(
          //     id
          // ))
        },
        // renderCell: (row: any, context: CellContext<any>) => {
        //   console.log("row", row);
        // },
      },
      {
        field: "unit",
        title: "Unit",
        editable: true,
        type: "text",
        renderCell: (row: any, context: CellContext<any>) => {
          //   let isEditingCell = context.tableConfig.apiRef?.current?.isEditing();

          //   if (isEditingCell) {
          return (
            <Select
              options={units}
              value={units[0].value}
              onBlur={() => {
                //   context.tableConfig.apiRef?.current?.exitCellEditMode();
              }}
              onChange={(value) => {
                // isEditingCell = false
              }}
            />
          );
          //   } else {
          return <div>{units[0].value}</div>;
          //   }
        },
      },
      { field: "quantity", title: "Quantity", editable: true, type: "number" },
      {
        field: "unitPriceCash",
        title: "Fiat/Unit",
        editable: true,
        type: "number",
      },
      {
        field: "unitPricePwt",
        title: "POWT/Unit",
        editable: true,
        type: "number",
      },
      {
        field: "totalPriceCash",
        title: "Total Fiat",
        editable: false,
        type: "number",
      },
      {
        field: "totalPricePwt",
        title: "Total POWT",
        editable: false,
        type: "number",
      },
    ],
    []
  );

  const data = [
    {
      id: 1,
      description: "some description",
      unit: units[0],
      quantity: 1,
      unitPriceCash: 1,
      unitPricePwt: 1,
      totalPriceCash: 1,
      totalPricePwt: 1,
    },
  ];

  return (
    <div className="mt-6">
      {/* Heading */}
      <div className="flex justify-between">
        <div className="flex items-center">
          <h1 className="text-1xl font-bold px-2">Line Items</h1>
        </div>
        <div className="flex items-center">
          <Tag
            onClick={() => {}}
            style={{
              cursor: "pointer",
              width: 28,
              height: 28,
              color: "white",
              fill: "#475264",
            }}
          />
        </div>
      </div>
      <div>
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs"
          onClick={() => {
            dispatch(
              actions.addLineItem({
                description: "Dummy Line Item",
                quantity: 5,
                unit: "HOUR",
                unitPriceCash: 2,
                unitPricePwt: 1,
                totalPriceCash: 5 * 2,
                totalPricePwt: 5 * 1,
              })
            );
          }}
        >
          Add Dummy Line Item
        </button> */}
        {/* <button className="bg-red-500 text-white px-4 py-2 rounded-md text-xs" onClick={() => {
            dispatch(
            );
          }}
        >
          Add Dummy Line Item
        </button> */}
      </div>
      <div className="mt-4">
        <ObjectSetTable
          key={state.lineItems.length}
          columns={columns as any}
          data={state.lineItems}
          //   onRowClick={() => {}}
          //   onRowDoubleClick={() => {}}
          //   onRowContextMenu={() => {}}
        />
      </div>
    </div>
  );
};

export default ObjectSetTableComponent;
