import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Badge,
  Chip,
  Avatar,
} from "@nextui-org/react";
import { FaCamera, FaEye, FaRegEdit, FaTrash } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";

interface TableListProps<T> {
  data: T[];
  columnKeys: string[];
  columnsHeaders: string[];
  rowsPerPage?: number;
  onView?: (item: T) => void;
  onUpdate?: (item: T) => void;
  onDelete?: (id: number) => void;
  onAdminConfirm?: (item: T) => void;
  imageKey?: string;
}

export default function TableList<T extends { id: string | number; role?: string }>({
  data = [],
  columnKeys,
  columnsHeaders,
  rowsPerPage = 10,
  onView,
  onUpdate,
  onDelete,
  onAdminConfirm,
  imageKey,
}: TableListProps<T>) {
  const [page, setPage] = React.useState(1);

  const pages =
    data && data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 0;

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const items = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data, rowsPerPage]);

  const showActions = true;

  const getNestedValue = (obj: any, path: string) => {
    const value = path.split(".").reduce((acc, key) => acc && acc[key], obj);
    return value === null || value === undefined ? "" : value;
  };

  const renderBooleanBadge = (value: boolean) => {
    return value ? (
      <Chip color="success">
        <span className="text-white cursor-pointer">Yes</span>
      </Chip>
    ) : (
      <Chip color="danger">
        <span className="text-white cursor-pointer">No</span>
      </Chip>
    );
  };

  const renderStatusBadge = (status: string) => {
    let color: "success" | "warning" | "danger" = "success";

    switch (status) {
      case "Pending":
        color = "warning";
        break;
      case "Confirmed":
        color = "success";
        break;
      case "Cancelled":
        color = "danger";
        break;
      default:
        break;
    }

    return (
      <Chip color={color}>
        <span className="text-white cursor-pointer">{status}</span>
      </Chip>
    );
  };

  return (
    <div>
      <Table
        aria-label="Table with client-side pagination"
        bottomContent={
          data &&
          data.length > 0 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          )
        }
        classNames={{
          wrapper: "min-h-[400px]",
        }}
      >
        <TableHeader>
          {[
            ...columnsHeaders.map((header) => (
              <TableColumn key={header}>
                {capitalizeFirstLetter(header)}
              </TableColumn>
            )),

            showActions && (
              <TableColumn key="actions" className="w-[100px]">
                Actions
              </TableColumn>
            ),
          ]}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {[
                ...columnKeys.map((key) => {
                  const value = getNestedValue(item, key);

                  if (key === imageKey && value) {
                    return (
                      <TableCell key={key}>
                        <Avatar isBordered radius="sm" src={value} />
                      </TableCell>
                    );
                  } else if (key === imageKey && !value) {
                    return (
                      <TableCell key={key}>
                        <Avatar
                          showFallback
                          src="https://images.unsplash.com/broken"
                          isBordered
                          radius="sm"
                          fallback={
                            <FaCamera
                              className="animate-pulse w-6 h-6 text-default-500"
                              fill="currentColor"
                              size={20}
                            />
                          }
                        />
                      </TableCell>
                    );
                  } else if (key === "status" && value) {
                    return (
                      <TableCell key={key}>
                        {typeof value === "string"
                          ? renderStatusBadge(value)
                          : String(value)}
                      </TableCell>
                    );
                  } else if (Array.isArray(value) && value) {
                    return (
                      <TableCell key={key}>
                        <div className="flex flex-wrap gap-2">
                          {value.map((menuItem, index) => (
                            <Chip key={index} color="primary" size="sm">
                              {menuItem.item.name}
                            </Chip>
                          ))}
                        </div>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={key}>
                      {typeof value === "boolean"
                        ? renderBooleanBadge(value)
                        : String(value)}
                    </TableCell>
                  );
                }),
                showActions && (
                  <TableCell>
                    <div className="flex gap-2">
                      {onView && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => {
                            onView(item);
                          }}
                        >
                          <FaEye className="h-4 w-4" />
                        </Button>
                      )}
                      {onUpdate && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => {
                            onUpdate(item);
                          }}
                        >
                          <FaRegEdit className="h-4 w-4" />
                        </Button>
                      )}
                      {onAdminConfirm && item?.role !== "ADMIN" && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => {
                            onAdminConfirm(item);
                          }}
                        >
                          <GrUserAdmin className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => {
                            onDelete(+item.id);
                          }}
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                ),
              ]}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
