import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableRow,
  } from "@/components/ui/table";
  
  import { useEffect, useState } from "react";
  
  export default function ControlTable() {
    // i'm too lazy to do an .env for this project
    const API_PATH = "http://localhost:5000";
    const [folder, setFolder] = useState("");
  
    const [isPending, setIsPending] = useState<boolean>(true);
    const [dataFolders, setDataFolders] = useState<string[]>([]);
    const [dataFiles, setDataFiles] = useState<string[]>([]);
  
    useEffect(() => {
      fetch(`${API_PATH}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folder }),
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
    }, [folder]);
  
    return (
      <>
        {isPending ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableCaption>A list of your recent folders.</TableCaption>
            <TableBody>
              {dataFolders.map((folderName, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <u>{folderName}</u>
                  </TableCell>
                  <TableCell>Credit Card</TableCell>
                </TableRow>
              ))}
              {dataFiles.map((fileName, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {fileName}
                  </TableCell>
                  <TableCell>Credit Card</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </>
    );
  }
  