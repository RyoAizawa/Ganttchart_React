import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export const Task = (props) => {
    let planSt = props.task.startDatePlan;
    let planEd = props.task.endDatePlan;
    let actSt = props.task.startDateAct;
    let actEd = props.task.endDateAct;

    const [planDiffDay, setPlanDiffDay] = useState();
    const [actDiffDay, setActDiffDay] = useState();
    const [colDays, setColDays] = useState([]);

    let startDatePlanRef = useRef();
    let endDatePlanRef = useRef();
    let startDateActRef = useRef();
    let endDateActRef = useRef();

    useEffect(() => {
        setColDays(createColDays(planSt, planEd, actSt, actEd));
        let diffDay = calcDiffDay(planSt, planEd);
        setPlanDiffDay(diffDay);
        diffDay = calcDiffDay(actSt, actEd);
        setActDiffDay(diffDay);
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

    // チャート表示箇所のカラム作成・日付けの入力に応じてチャートバーの作成も同時に行うメソッド
    const createColDays = (planStart, planEnd, actStart, actEnd) => {
        const chartHeadDay = dateTimeFormatJP.format(
            new Date(props.fullDateArray[0])
        );

        const colDaysArray = props.fullDateArray.map((elem, i) => {
            let planBar = "";
            let actBar = "";
            const formattedColDate = dateTimeFormatJP.format(new Date(elem));
            if (planStart !== "" && planEnd !== "") {
                // 開始日がチャート開始日程より以前の場合には起点をチャート日程の先頭に合わせる
                // チャート先頭日 - 開始日がマイナスになれば差分が0で返ってくる
                if (calcDiffDay(props.fullDateArray[0], planStart) === 0) {
                    planStart = props.fullDateArray[0];
                }
                // 終了日がチャート終了日程より以後の場合には終点をチャート日程の末端に合わせる
                // チャート最終日 - 終了日がプラスになれば差分が0以上で返ってくる
                if (0 < calcDiffDay(props.fullDateArray[props.fullDateArray.length - 1], planEnd)) {
                    planEnd = props.fullDateArray[props.fullDateArray.length - 1];
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
                    planBar = (
                        <PlanBar
                            width={`calc(${100 * diff}% + ${diff * 1 + 1}px)`}
                            display={`${display}`}
                        >
                            <ProgBar></ProgBar>
                        </PlanBar>
                    );
                }
            }
            if (actStart !== "" && actEnd !== "") {
                if (calcDiffDay(props.fullDateArray[0], actStart) === 0) {
                    actStart = props.fullDateArray[0];
                }
                if (1 <calcDiffDay(props.fullDateArray[props.fullDateArray.length - 1], actEnd)) {
                    actEnd = props.fullDateArray[props.fullDateArray.length - 1];
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
                            display={`${display}`}
                        ></ActBar>
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
        return colDaysArray;
    };

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
        const planSt = startDatePlanRef.current.value;
        const planEd = endDatePlanRef.current.value;
        const actSt = startDateActRef.current.value;
        const actEd = endDateActRef.current.value;

        if (process === "plan") {
            // 終了日は開始日以前を設定できないようにする
            if (planSt !== "") {
                endDatePlanRef.current.setAttribute("min", planSt);
            }
            // 開始、終了の日付けがセットされているか確認
            if (planSt !== "" && planEd !== "") {
                // 、予定、実績それぞれの開始/終了がセットされていれば差分を計算する
                const diffDay = calcDiffDay(planSt, planEd);
                setPlanDiffDay(diffDay);
                setColDays(createColDays(planSt, planEd, actSt, actEd));
            }
        } else {
            if (actSt !== "") {
                endDateActRef.current.setAttribute("min", actSt);
            }
            if (actSt !== "" && actEd !== "") {
                const diffDay = calcDiffDay(actSt, actEd);
                setActDiffDay(diffDay);
                setColDays(createColDays(planSt, planEd, actSt, actEd));
            }
        }
    };

    // 設定した開始日、終了日の情報をもとにチャートバーを作成
    const setChartBar = (diffDay, bar, stDate, edDate) => {
        // チャートの起点を決める
        // colDays.forEach((col) => {
        //     if (col.props.name === dateTimeFormatJP.format(new Date(stDate))) {
        //         console.log(col);
        //     }
        // });
        // if (stDate < today) {
        //     // 本日以前の日付けを選んだ場合、起点は本日とする
        //     selectedDateCol = selectedRow.children(`td[name=${today}]`);
        // } else if (selectedRow.children(`td[name=${stDate}]`).length < 1) {
        //     // テーブルにない日付けを開始日に選択した場合、バーを消して早期return
        //     $(`#${process}Bar_${index}`).css("display", "none");
        //     return;
        // }
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
    };

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
                <Td>{planDiffDay}</Td>
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
                <Td>{actDiffDay}</Td>
                <Td></Td>
                {colDays}
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

const DateTd = styled.td`
    position: relative;
    border: 1px solid #aaa;
    text-align: center;
`;

const TaskTitle = styled(Td)`
    width: 200px;
`;

const InputDate = styled.input`
    max-width: 100px;
`;
const InputRange = styled.input`
    max-width: 60px;
`;

const PlanBar = styled.div`
    position: absolute;
    display: ${(props) => (props.display ? props.display : "block")};
    width: ${(props) => (props.width ? props.width : "100%")};
    top: 50%;
    height: 50%;
    transform: translateY(-50%);
    background: #93bef3;
    z-index: 1;
`;

const ActBar = styled.div`
    position: absolute;
    display: ${(props) => (props.display ? props.display : "block")};
    width: ${(props) => (props.width ? props.width : "100%")};
    bottom: 25%;
    height: 5px;
    background-color: blue;
    border: none;
    z-index: 2;
`;

const ProgBar = styled.div`
    height: 100%;
    width: 0px;
    background: #ffc135;
`;

export default Task;
