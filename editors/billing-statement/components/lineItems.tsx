import { Tag } from "lucide-react";

const LineItems = () => {
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
    </div>
  );
};

export default LineItems;
