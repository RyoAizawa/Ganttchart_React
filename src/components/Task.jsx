import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export const Task = (props) => {
    let planSt = props.task.startDatePlan;
    let planEd = props.task.endDatePlan;
    let actSt = props.task.startDateAct;
    let actEd = props.task.endDateAct;

    const [diffDay, setDiffDay] = useState({ plan: 0 }, { act: 0 });
    const [colDays, setColDays] = useState([]);
    const [ahead, setAhead] = useState({ text: "" }, { color: "" });

    const startDatePlanRef = useRef();
    const endDatePlanRef = useRef();
    const startDateActRef = useRef();
    const endDateActRef = useRef();
    const progBarRange = useRef();
    const progBarRef = useRef();
    const aheadRef = useRef();
    const tableRowRef = useRef();
    const selectRef = useRef();

    useEffect(() => {
        setColDays(createColDays(planSt, planEd, actSt, actEd));
        const planDiff = calcDiffDay(planSt, planEd);
        const actDiff = calcDiffDay(actSt, actEd);
        setDiffDay({ ...diffDay, plan: planDiff, act: actDiff });
        progBarDisabled(planSt, planEd);
        return () => {};
    }, []);

    // YYYY/MM/DDからYYYY-MM-DDにフォーマットするメソッド
    const dateTimeFormat = (date) => {
        if (date === null) return;
        const dateJp = dateTimeFormatJP.format(new Date(date));
        return dateJp.replace(/\//g, "-");
    };
    // 日付けを日本時間のYYYY/MM/DDにフォーマットするメソッド
    const dateTimeFormatJP = new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    // チャート表示箇所のカラム作成・日付けの入力に応じてチャートバーの作成も同時に行うメソッド
    const createColDays = (planStart, planEnd, actStart, actEnd) => {
        const chartHeadDay = dateTimeFormatJP.format(
            new Date(props.fullDateArray[0])
        );

        const colDaysArray = props.fullDateArray.map((elem, i) => {
            let planBar = "";
            let actBar = "";
            let progBar = "";
            const formattedColDate = dateTimeFormatJP.format(new Date(elem));
            if (planStart !== "" && planEnd !== "") {
                // 開始日がチャート開始日程より以前の場合には起点をチャート日程の先頭に合わせる
                // チャート先頭日 - 開始日がマイナスになれば差分が0で返ってくる
                if (calcDiffDay(props.fullDateArray[0], planStart) === 0) {
                    planStart = props.fullDateArray[0];
                }
                // 終了日がチャート終了日程より以後の場合には終点をチャート日程の末端に合わせる
                // チャート最終日 - 終了日がプラスになれば差分が0以上で返ってくる
                if (
                    0 <
                    calcDiffDay(
                        props.fullDateArray[props.fullDateArray.length - 1],
                        planEnd
                    )
                ) {
                    planEnd =
                        props.fullDateArray[props.fullDateArray.length - 1];
                }
                const formattedStDatePlan = dateTimeFormatJP.format(
                    new Date(planStart)
                );

                // カラムに対応した日付けが一致した場合、プランバーの作成
                if (formattedColDate === formattedStDatePlan) {
                    const diff = calcDiffDay(planStart, planEnd);
                    let display = "";

                    if (diff < 1) {
                        display = "none";
                    }

                    progBar = (
                        <ProgBar
                            ref={progBarRef}
                            width={`${progBarRange.current.value}%`}
                        ></ProgBar>
                    );
                    planBar = (
                        <PlanBar
                            width={`calc(${100 * diff}% + ${diff * 1 + 1}px)`}
                            display={`${display}`}
                        >
                            {progBar}
                        </PlanBar>
                    );
                }
            }

            if (actStart !== "" && actEnd !== "" && actEnd !== null) {
                if (calcDiffDay(props.fullDateArray[0], actStart) === 0) {
                    actStart = props.fullDateArray[0];
                }
                if (
                    1 <
                    calcDiffDay(
                        props.fullDateArray[props.fullDateArray.length - 1],
                        actEnd
                    )
                ) {
                    actEnd =
                        props.fullDateArray[props.fullDateArray.length - 1];
                }

                const formattedStDateAct = dateTimeFormatJP.format(
                    new Date(actStart)
                );
                if (formattedStDateAct < chartHeadDay) {
                    actStart = chartHeadDay;
                }
                if (formattedColDate === formattedStDateAct) {
                    const diff = calcDiffDay(actStart, actEnd);
                    let display = "";

                    if (diff < 1) {
                        display = "none";
                    }
                    actBar = (
                        <ActBar
                            width={`calc(${100 * diff}% + ${diff * 1 + 1}px)`}
                            display={display}
                        ></ActBar>
                    );
                }
            }
            // 実績の開始日だけ設定されている場合の処理
            else if (actStart !== "") {
                const formattedStDateAct = dateTimeFormatJP.format(
                    new Date(actStart)
                );
                let display = "";
                if (formattedColDate === formattedStDateAct) {
                    actBar = (
                        <ActBar width={`15px`} display={`${display}`}></ActBar>
                    );
                }
            }
            return (
                <DateTd
                    ref={(el) => (colDays[i] = el)}
                    key={i}
                    name={formattedColDate}
                >
                    {planBar}
                    {actBar}
                </DateTd>
            );
        });
        setAhead({ ...ahead, text: "", color: "" });
        // 予定よりも終了実績が早ければ先行に〇
        if (actEnd !== "" && planEnd > actEnd) {
            setAhead({ ...ahead, text: "〇", color: "#88e5ff" });
            aheadRef.current.style.backgroundColor = ahead.color;
        }
        return colDaysArray;
    };

    // 予定、実績にセットされた日付けの差分を計算
    const calcDiffDay = (stDate, edDate) => {
        if (stDate === null || edDate === null) return "";
        const startDate = new Date(stDate);
        const endDate = new Date(edDate);
        const diffTime = endDate.getTime() - startDate.getTime();
        let diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        // マイナス値になった場合は0を設定しておく
        if (diffDay < 0) diffDay = 0;
        return diffDay;
    };

    // // 日付けがセットされた後の挙動
    const checkDate = (process) => {
        planSt = startDatePlanRef.current.value;
        planEd = endDatePlanRef.current.value;
        actSt = startDateActRef.current.value;
        actEd = endDateActRef.current.value;

        progBarDisabled(planSt, planEd);

        if (process === "plan") {
            // 終了日は開始日以前を設定できないようにする
            if (planSt !== "") {
                endDatePlanRef.current.setAttribute("min", planSt);
            }
            // 開始、終了の日付けがセットされているか確認
            if (planSt !== "" && planEd !== "") {
                // 、予定、実績それぞれの開始/終了がセットされていれば差分を計算する
                const diff = calcDiffDay(planSt, planEd);
                setDiffDay({ ...diffDay, plan: diff });
                setColDays(createColDays(planSt, planEd, actSt, actEd));
            }
        } else {
            if (actSt !== "") {
                endDateActRef.current.setAttribute("min", actSt);
            }
            if (actSt !== "") {
                if (actSt !== "" && actEd !== "") {
                    const diff = calcDiffDay(actSt, actEd);
                    setDiffDay({ ...diffDay, act: diff });
                }
                setColDays(createColDays(planSt, planEd, actSt, actEd));
            }
        }
    };

    // 進捗バーの進退を制御
    const setProgBar = () => {
        progBarRef.current.style.width = `${progBarRange.current.value}%`;
    };

    // 選択行のドラッグ開始
    const dragStart = (index) => {
        props.handleDragIndex(index);
    };

    // 選択行のドラッグ中行の上に乗った状態
    const dragEnter = (index) => {
        let selectedCount = 0;
        props.tableData.map((rowData) => {
            if (rowData.selected) selectedCount++;
        });

        const selectedRow = [];
        props.tableData.map((rowData) => {
            if (rowData.selected) {
                if (
                    //  ドラッグ中乗った行が、全体の行数を超えず掴んでるものより後の行
                    index > props.dragIndex &&
                    index <= props.tableData.length - selectedCount
                ) {
                    selectedRow.push(rowData.trIndex++);
                } else if (index < props.dragIndex) {
                    //  ドラッグ中乗った行が、掴んでるものより前の行
                    selectedRow.push(rowData.trIndex--);
                }
            }
        });

        props.setTasks((prevData) => {
            let newTasks = JSON.parse(JSON.stringify(prevData));
            let deleteElement = [];
            selectedRow.forEach((elem, i) => {
                // 選択済み行を取り出す（元の配列からは消える）
                const newTask = newTasks.splice(elem - i, 1)[0];
                deleteElement.push(newTask);
            });
            // 取り出した行を、指定したインデックスに追加
            deleteElement.forEach((elem, i) => {
                newTasks.splice(index + i, 0, elem);
            });
            return newTasks;
        });

        props.handleTableData();
        props.handleDragIndex(index);
    };

    // 行をクリック
    const selectedRows = () => {
        const tableRowAll = document.querySelectorAll("tr[name='tableRow']");
        props.tableData.map((rowData, i) => {
            if (rowData.selected) {
                tableRowAll[i].style.backgroundColor = "#c2feff";
                tableRowAll[i].draggable = true;
            } else {
                tableRowAll[i].removeAttribute("style");
                tableRowAll[i].draggable = false;
            }
        });
    };

    const progBarDisabled = (st, ed) => {
        if (st === null || ed === null) progBarRange.current.disabled = true;
        else progBarRange.current.disabled = false;
    };

    // タスクを削除する関数
    const deleteTask = async (id, title) => {
        if (confirm(`このタスクを削除してよろしいですか？\n${title}`)) {
            try {
                await props.useFetch.get(`/api/delete/${id}`);
                window.location.reload();
            } catch (error) {
                console.error("Error delete task:", error);
            }
        }
    };

    const editClick = (id, title, name) => {
        const contentObj = {
            id: id,
            title: title,
            name: name,
            startDatePlan: startDatePlanRef.current.value,
            endDatePlan: endDatePlanRef.current.value,
            startDateAct: startDateActRef.current.value,
            endDateAct: endDateActRef.current.value,
            status: selectRef.current.value,
            progBarValue: progBarRange.current.value,
        };
        props.handleEdit(contentObj);
    };

    return (
        <>
            <tr
                name="tableRow"
                ref={tableRowRef}
                draggable={false}
                onDragStart={() => dragStart(props.trIndex)}
                onDragEnter={() => dragEnter(props.trIndex)}
                onDragEnd={() => props.handleTableData()}
            >
                <Td>
                    <Btn
                        color={"red"}
                        onClick={() =>
                            deleteTask(props.task.id, props.task.title)
                        }
                    >
                        削除
                    </Btn>
                </Td>
                <Td>
                    <Btn
                        color={"#00a903"}
                        onClick={() =>
                            editClick(
                                props.task.id,
                                props.task.title,
                                props.task.name
                            )
                        }
                    >
                        編集
                    </Btn>
                </Td>
                <Td>{props.task.id}</Td>
                <TaskTitle
                    onClick={() => {
                        props.handleRowClick(props.trIndex);
                        selectedRows(props.trIndex);
                    }}
                    $indent={props.tableData.map((data) => {
                        if (data.trIndex === props.trIndex) {
                            return 12 * data.indentIndex + "px";
                        }
                    })}
                >
                    {props.task.title}
                </TaskTitle>
                <Td className="name">{props.task.name}</Td>
                <Td>
                    <InputRange
                        ref={progBarRange}
                        type="range"
                        step="10"
                        min="0"
                        max="100"
                        defaultValue={props.task.progress}
                        onChange={() => setProgBar()}
                    />
                </Td>
                <Td>
                    <select ref={selectRef} defaultValue={props.task.status}>
                        <option value="未着手">未着手</option>
                        <option value="進行中">進行中</option>
                        <option value="保留">保留</option>
                        <option value="完了">完了</option>
                    </select>
                </Td>
                <Td>
                    <InputDate
                        ref={startDatePlanRef}
                        type="date"
                        defaultValue={dateTimeFormat(planSt)}
                        onChange={() => checkDate("plan")}
                    />
                </Td>
                <Td>
                    <InputDate
                        ref={endDatePlanRef}
                        type="date"
                        defaultValue={dateTimeFormat(planEd)}
                        onChange={() => checkDate("plan")}
                    />
                </Td>
                <Td>{diffDay.plan}</Td>
                <Td>
                    <InputDate
                        ref={startDateActRef}
                        type="date"
                        defaultValue={dateTimeFormat(actSt)}
                        onChange={() => checkDate("act")}
                    />
                </Td>
                <Td>
                    <InputDate
                        ref={endDateActRef}
                        type="date"
                        defaultValue={dateTimeFormat(actEd)}
                        onChange={() => checkDate("act")}
                    />
                </Td>
                <Td>{diffDay.act}</Td>
                <Td ref={aheadRef} color={ahead.color}>
                    {ahead.text}
                </Td>
                {colDays}
            </tr>
        </>
    );
};

const Btn = styled.button`
    min-width: 50px;
    border: 1px solid #aaa;
    color: #fff;
    background-color: ${(props) => (props.color ? props.color : "")};
    &:hover {
        opacity: 0.5;
    }
`;

const Td = styled.td`
    padding: 7px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
    background-color: ${(props) => (props.color ? props.color : "")};
    &.name {
        min-width: 50px;
    }
`;

const DateTd = styled.td`
    position: relative;
    border: 1px solid #aaa;
    text-align: center;
`;

const TaskTitle = styled(Td)`
    text-align: left;
    min-width: 200px;
    text-indent: ${(props) => (props.$indent ? props.$indent : 0)};
`;

const InputDate = styled.input`
    max-width: 100px;
`;
const InputRange = styled.input`
    max-width: 50px;
`;

const PlanBar = styled.div`
    position: absolute;
    display: ${(props) => (props.display ? props.display : "block")};
    width: ${(props) => (props.width ? props.width : "100%")};
    top: 50%;
    height: 50%;
    transform: translateY(-50%);
    background: #93bef3;
    z-index: -1;
`;

const ActBar = styled.div`
    position: absolute;
    display: ${(props) => (props.display ? props.display : "block")};
    width: ${(props) => (props.width ? props.width : "100%")};
    bottom: 25%;
    height: 5px;
    background-color: blue;
    border: none;
    z-index: 0;
`;

const ProgBar = styled.div`
    height: 100%;
    width: ${(props) => (props.width ? props.width : "0%")};
    background: #ffc135;
`;

export default Task;
