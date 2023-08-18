import { useEffect, useRef } from "react";
import styled from "styled-components";

export const Task = (props) => {
    let startDatePlanRef = useRef();
    let endDatePlanRef = useRef();
    let startDateActRef = useRef();
    let endDateActRef = useRef();
    let colDays = useRef()
    let planDiffDay = useRef();
    let actDiffDay = useRef();
    console.log("hey")
    useEffect(() => {
        setPlanDiffDay(props.task.startDatePlan, props.task.endDatePlan);
        setActDiffDay(props.task.startDateAct, props.task.endDateAct);
        return () => {};
    }, []);

    // YYYY/MM/DDからYYYY-MM-DDにフォーマットするメソッド
    const dateTimeFormat = (date) => {
        const dateJp = dateTimeFormatJP.format(new Date(date));
        return dateJp.replace(/\//g, "-");
    };
    // 日付けを日本時間のYYYY/MM/DDにフォーマットするメソッド
    const dateTimeFormatJP = new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    // 予定、実績にセットされた日付けの差分を計算
    const calcDiffDay = (stDate, edDate) => {
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
        if (process === "plan") {
            // 終了日は開始日以前を設定できないようにする
            if (startDatePlanRef.current.value !== "") {
                endDatePlanRef.current.setAttribute(
                    "min",
                    startDatePlanRef.current.value
                );
            }
            // 開始、終了の日付けがセットされているか確認
            if (startDatePlanRef.current.value !== "" &&
                endDatePlanRef.current.value !== ""
            ) {
                // 、予定、実績それぞれの開始/終了がセットされていれば差分を計算する
                planDiffDay = setPlanDiffDay(
                    startDatePlanRef.current.value,
                    endDatePlanRef.current.value
                );
            }
        } else {
            if (startDateActRef.current.value !== "") {
                endDateActRef.current.setAttribute(
                    "min",
                    startDateActRef.current.value
                );
            }
            if (startDatePlanRef.current.value !== "" &&
                endDatePlanRef.current.value !== ""
            ) {
                actDiffDay = setActDiffDay(
                    startDateActRef.current.value,
                    endDateActRef.current.value
                );
            }
        }
    };

    const setPlanDiffDay = (start, end) => {
        const diffDay = calcDiffDay(start, end);
        console.log(planDiffDay)
        planDiffDay.current.innerHTML = diffDay;
    };
    const setActDiffDay = (start, end) => {
        const diffDay = calcDiffDay(start, end);
        actDiffDay.current.innerHTML = diffDay;
    };

    // 設定した開始日、終了日の情報をもとにチャートバーを作成
    // const setChartBar = (diffDay) => {
    //     // もしも差分日数が0かマイナス値になっていた場合はバーを非表示にして早期return
    //     if (diffDay < 1) {
    //         $(`#${process}Bar_${index}`).css("display", "none")
    //         return
    //     }
    //     // 日付けをセットした行を取得
    //     const selectedRow = $(`#${process}St_${index}`).parent().parent()
    //     // 非表示にしたバーを再表示
    //     $(`#${process}Bar_${index}`).css("display", "block")
    //     // チャートの起点を決める
    //     let selectedDateCol = selectedRow.children(`td[name=${stDate}]`)
    //     if (stDate < today) {
    //         // 本日以前の日付けを選んだ場合、起点は本日とする
    //         selectedDateCol = selectedRow.children(`td[name=${today}]`)
    //     }
    //     else if (selectedRow.children(`td[name=${stDate}]`).length < 1) {
    //         // テーブルにない日付けを開始日に選択した場合、バーを消して早期return
    //         $(`#${process}Bar_${index}`).css("display", "none")
    //         return
    //     }
    //     // 起点は全ての日付けカラム内の何番目か
    //     let startColumnIndex = 0
    //     let columnCount = 0
    //     selectedRow.children(".col_day").each((i, column) => {
    //         if (column.isEqualNode(selectedDateCol[0])) {
    //             startColumnIndex = i
    //         }
    //         columnCount = i + 1
    //     })
    //     // 差分がバーのチャートバーのカラムサイズとなる
    //     let barColumCount = diffDay
    //     // 開始日が本日の日付け以前の場合、開始日から本日までの差分を取得
    //     if (stDate < today) {
    //         const diffDayForToday = calcDiffDay(stDate, today)
    //         barColumCount -= diffDayForToday - 1
    //     }
    //     // 差分が起点以降の空きカラム数を超えたらバーのサイズは空きカラムの領域を超えないようにする
    //     if (barColumCount > (columnCount - startColumnIndex)) {
    //         barColumCount = columnCount - startColumnIndex
    //     }
    //     // 1本分のボーダーサイズを取得
    //     const border = (selectedDateCol.outerWidth() - selectedDateCol.innerWidth()) / 2
    //     // 要素の幅+ボーダー*カラム数でバーサイズを計算
    //     const barSize = ((selectedDateCol.innerWidth() + border) * barColumCount)
    //     // 起点と終端のpadding = 1px分を調整しバーの幅を設定
    //     $(`#${process}Bar_${index}`).css("width", `${barSize - 2}px`)
    //     // 起点の情報を取得出来たらバーを設定した起点に移動
    //     if (selectedDateCol.length > 0) selectedDateCol.append($(`#${process}Bar_${index}`))
    // }



    return (
        <>
            <tr>
                <Td>{props.task.id}</Td>
                <TaskTitle>{props.task.title}</TaskTitle>
                <Td>{props.task.name}</Td>
                <Td>
                    <InputRange
                        type="range"
                        step="10"
                        min="0"
                        max="100"
                        defaultValue={0}
                    />
                </Td>
                <Td>進行中</Td>
                <Td>
                    <InputDate
                        ref={startDatePlanRef}
                        id={`planSt_${props.task.id}`}
                        type="date"
                        defaultValue={dateTimeFormat(props.task.startDatePlan)}
                        onChange={() => checkDate("plan")}
                    />
                </Td>
                <Td>
                    <InputDate
                        ref={endDatePlanRef}
                        id={`planEd_${props.task.id}`}
                        type="date"
                        defaultValue={dateTimeFormat(props.task.endDatePlan)}
                        onChange={() => checkDate("plan")}
                    />
                </Td>
                <Td ref={planDiffDay}></Td>
                <Td>
                    <InputDate
                        ref={startDateActRef}
                        id={`actSt_${props.task.id}`}
                        type="date"
                        defaultValue={dateTimeFormat(props.task.startDateAct)}
                        onChange={() => checkDate("act")}
                    />
                </Td>
                <Td>
                    <InputDate
                        ref={endDateActRef}
                        id={`actEd_${props.task.id}`}
                        type="date"
                        defaultValue={dateTimeFormat(props.task.endDateAct)}
                        onChange={() => checkDate("act")}
                    />
                </Td>
                <Td ref={actDiffDay}></Td>
                <Td>
                    <div id="planBar_1" className="planBar bar">
                        <div id="progBar_1" className="progBar"></div>
                    </div>
                    <div id="actBar_1" className="actBar bar"></div>
                </Td>
                {(function () {
                    const array = []
                    props.fullDate.forEach((elem, i) => {
                        array.push(<Td key={i} name={elem}></Td>);
                    })
                    colDays = [...array]
                    return colDays;
                })()}
            </tr>
        </>
    );
};

const Td = styled.td`
    padding: 5px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
`;
const TaskTitle = styled.td`
    padding: 5px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
    width: 200px;
`;

const InputDate = styled.input`
    max-width: 100px;
`;
const InputRange = styled.input`
    max-width: 60px;
`;
export default Task;
