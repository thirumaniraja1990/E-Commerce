import React from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";



function MuiTable(props) {
  const { columns, data, actions } = props;
  const table = useMaterialReactTable({
    columns,
    data,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableColumnFilters: false,
    enableEditing: true,
    renderRowActions: actions,
    enableSorting: false,
    enableSortingRemoval: false,
    positionActionsColumn: "last",
    muiTableHeadCellProps: {
      sx: () => ({
        backgroundColor: "#0a1d37",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
      }),
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
        border: "1px solid #e0e0e0",
      },
    },
  });
  return (
    <div style={{ display: "grid" }}>
      <MaterialReactTable table={table} />
    </div>
  );
}

export default MuiTable;