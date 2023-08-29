import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Task from "./Task";
import TaskHeader from "./TaskHeader";
import ModalWindow from "./ModalWindow";
import styled from "styled-components";

export const ChartTable = (props) => {
    const [tasks, setTasks] = useState(props.taskData);
    const [dragIndex, setDragIndex] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [isShowEdit, setIsShowEdit] = useState(false);
    const [isShowAdd, setIsShowAdd] = useState(false);
    const [editContent, setEditContent] = useState({});

    let prevTaskRef = useRef(tasks);

    const handleDragIndex = (selectedRows) => {
        setDragIndex(selectedRows);
    };

    const handleEdit = (contentArray) => {
        setIsShowEdit(true);
        setEditContent(contentArray);
    };

    const handleClose = (process) => {
        process === "edit" ? setIsShowEdit(false) : setIsShowAdd(false)
    };

    useEffect(() => {
        setTableData(
            tasks.map((task, index) => {
                return {
                    ...tableData,
                    trIndex: index,
                    selected: false,
                    indentIndex: 0,
                };
            })
        );
    }, []);

    useEffect(() => {
        indentControl(props.indentProcess);
        return () => {};
    }, [props.indentProcess]);

    const useFetch = axios.create({
        baseURL: "http://localhost:3001",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*",
        },
        timeout: 2000,
    });

    // ガントチャートに出力する日数
    const columnsValue = 30;
    // 当日から何日前からの日付けを出力するか指定
    const daysAgo = 15;

    // テーブルヘッダ表示の日付を出力
    const today = new Date();
    let colDates = [];
    // 指定した日数前から、指定した日数分日付けを配列に取得する
    for (let i = -daysAgo; i < columnsValue - daysAgo; i++) {
        const newDate = new Date();
        newDate.setDate(today.getDate() + i);
        colDates.push(newDate);
    }

    const fullDateArray = [];
    // 整合性を取るためにYYYY/MM/DDのデータを指定日数分作成する
    colDates.forEach((date) => {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const fullDate = `${y}/${m}/${d}`;
        fullDateArray.push(fullDate);
    });

    // テーブル行がクリックされたときの処理
    const handleRowClick = (index) => {
        tableData.map((data) => {
            // 選択された行の選択状況を反転する
            if (data.trIndex === index) {
                data.selected === false
                    ? (data.selected = true)
                    : (data.selected = false);
            } else {
                if (!window.event.ctrlKey && data.selected) {
                    data.selected = false;
                }
            }
        });
    };

    // 行データを移動した後に呼ばれるメソッド。選択済み
    const handleTableData = () => {
        // 移動後のテーブルの状況を確認するために移動後のインデックス番号を取得
        let newTableDataIndex = [];
        prevTaskRef.current.forEach((prevData) => {
            tasks.forEach((newData, index) => {
                if (JSON.stringify(prevData) == JSON.stringify(newData)) {
                    newTableDataIndex.push(index);
                }
            });
        });

        // 移動後の選択状況へテーブルのデータを上書きする
        let newTableData = [];
        tableData.forEach((prevData, trIndex) => {
            newTableDataIndex.forEach((newIndex, orgIndex) => {
                if (trIndex === newIndex) {
                    const dataObj = tableData[orgIndex];
                    dataObj.trIndex = trIndex;
                    newTableData.push(dataObj);
                }
            });
        });
        setTableData(newTableData);
        prevTaskRef.current = [...tasks];
    };

    // ヘッダのインデントボタンが押された際に、選択された行のインデックスを加減する
    const indentControl = (process) => {
        tableData.forEach((data) => {
            if (data.selected) {
                if (process === "up") {
                    if (data.indentIndex < 3) data.indentIndex++;
                } else if (process === "down") {
                    if (data.indentIndex > 0) data.indentIndex--;
                }
            }
        });
    };

    return (
        <>
            <Table>
                <Thead>
                    <TaskHeader fullDateArray={fullDateArray} />
                </Thead>
                <Tbody>
                    {tasks.map((task, index) => {
                        return (
                            <Task
                                key={task.id}
                                trIndex={index}
                                task={task}
                                setTasks={setTasks}
                                dragIndex={dragIndex}
                                handleDragIndex={handleDragIndex}
                                handleRowClick={handleRowClick}
                                setTableData={setTableData}
                                tableData={tableData}
                                handleTableData={handleTableData}
                                fullDateArray={fullDateArray}
                                handleEdit={handleEdit}
                                useFetch={useFetch}
                            />
                        );
                    })}
                </Tbody>
            </Table>
            <ModalWindow
                process={"edit"}
                isShow={isShowEdit}
                handleClose={handleClose}
                editContent={editContent}
                useFetch={useFetch}
            />
            <AddBtn>
                <button onClick={() => setIsShowAdd(true)}>
                    新規タスクの追加
                </button>
            </AddBtn>
            <ModalWindow
                process={"add"}
                isShow={isShowAdd}
                handleClose={handleClose}
                useFetch={useFetch}
            />
        </>
    );
};

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
`;
const Thead = styled.thead`
    background: #006caa;
    color: white;
`;
const Tbody = styled.tbody``;

const AddBtn = styled.div`
    margin: 10px;
    > button {
        color: #fff;
        background-color: #2142ff;
        padding: 10px;
        border: none;
        border-radius: 10px;
        &:hover {
            opacity: 0.5;
        }
    }
`;

export default ChartTable;
