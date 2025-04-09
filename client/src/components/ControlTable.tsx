import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import { useLocation, Link } from "react-router-dom";

import { useEffect, useState } from "react";

type file = {
  ContentType: string;
  Key: string;
  LastModified: string;
  Size: number;
};

const getParentDirectory = (path: string) => {
  if (!path || path === "/") {
    return path;
  }

  if (path.endsWith("/") && path !== "/") {
    path = path.slice(0, -1);
  }

  const segments = path.split("/");

  segments.pop();

  const parent = segments.join("/");

  console.log(parent === "" ? "/" : parent);

  return parent === "" ? "/" : parent;
};

const getJustFileName = (filePath: string) => {
  if (!filePath || !filePath.includes("/")) {
    return filePath;
  }

  const chunks = filePath.split("/").filter(Boolean);

  return chunks[chunks.length - 1];
};

export default function ControlTable() {
  // i'm too lazy to do an .env for this project
  const API_PATH = import.meta.env.VITE_API_ENDPOINT;
  const S3_PUBLIC_URL = import.meta.env.VITE_S3_BUCKET_BASE;

  const folder = useLocation();
  const path = location.pathname.startsWith("/")
    ? location.pathname.slice(1)
    : location.pathname;

  const [isPending, setIsPending] = useState<boolean>(true);
  const [dataFolders, setDataFolders] = useState<string[]>([]);
  const [dataFiles, setDataFiles] = useState<file[]>([]);
  const [loadtime, setLoadtime] = useState(-1);

  useEffect(() => {
    const start: number = Date.now();
    setIsPending(true);
    fetch(`${API_PATH}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder: path }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDataFiles(data.files || []);
        setDataFolders(data.folders || []);
        setIsPending(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsPending(false);
      });

    setLoadtime(Date.now() - start);
  }, [folder]);

  return (
    <>
      <div className="mt-10">
        {isPending ? (
          <Skeleton className="h-10 w-[300px] rounded-md" />
        ) : (
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {`Viewing ~/${path}`}
          </h2>
        )}
      </div>

      <Table>
        <TableCaption>
          {!isPending &&
            `Discovered ${dataFolders.length} folder(s) and ${dataFiles.length} file(s) in ${loadtime}ms`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">File Type</TableHead>
            <TableHead className="hidden sm:table-cell">Size</TableHead>
            <TableHead className="hidden sm:table-cell">
              Last Modified
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending &&
            [...Array(dataFiles.length)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))}
          {!isPending && (
            <>
              {dataFolders.length > 0 ? (
                dataFolders.map((folderName, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link to={`${folderName}`}>[{folderName}]</Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">...</TableCell>
                    <TableCell className="hidden sm:table-cell">...</TableCell>
                    <TableCell className="hidden sm:table-cell">...</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key={0}>
                  <TableCell>
                    <Link to={`${getParentDirectory(path)}`}>[...]</Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">...</TableCell>
                  <TableCell className="hidden sm:table-cell">...</TableCell>
                  <TableCell className="hidden sm:table-cell">...</TableCell>
                </TableRow>
              )}

              {dataFiles.map((fileName, index) => (
                <TableRow key={`file-${index}`}>
                  <TableCell>
                    <a
                      href={`${S3_PUBLIC_URL}/${fileName.Key}`}
                      target="_blank"
                    >
                      {getJustFileName(fileName.Key)}
                    </a>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {fileName.ContentType}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {fileName.Size}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {fileName.LastModified}
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </>
  );
}
