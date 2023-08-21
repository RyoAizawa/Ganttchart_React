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
    const [ahead, setAhead] = useState({ text: "" }, { color: "" });

    const startDatePlanRef = useRef();
    const endDatePlanRef = useRef();
    const startDateActRef = useRef();
    const endDateActRef = useRef();
    const progBarRange = useRef();
    const progBar = useRef();
    const aheadRef = useRef();

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
                    planBar = (
                        <PlanBar
                            width={`calc(${100 * diff}% + ${diff * 1 + 1}px)`}
                            display={`${display}`}
                        >
                            <ProgBar ref={progBar}></ProgBar>
                        </PlanBar>
                    );
                }
            }
            if (actStart !== "" && actEnd !== "") {
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
        setAhead({ ...ahead, text: "", color: "" });
        // 予定よりも終了実績が早ければ先行に〇
        if (planEnd > actEnd) {
            setAhead({ ...ahead, text: "〇", color: "#88e5ff" });
            aheadRef.current.style.backGroundColor = ahead.color;
        }
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

    // 進捗バーの進退を制御
    const setProgBar = () => {
        progBar.current.style.width = `${progBarRange.current.value}%`;
    };

    return (
        <>
            <tr>
                <Td>{props.task.id}</Td>
                <TaskTitle>{props.task.title}</TaskTitle>
                <Td>{props.task.name}</Td>
                <Td>
                    <InputRange
                        ref={progBarRange}
                        type="range"
                        step="10"
                        min="0"
                        max="100"
                        defaultValue={0}
                        onChange={() => setProgBar()}
                    />
                </Td>
                <Td>
                    <select name="status">
                        <option value="">未着手</option>
                        <option value="">進行中</option>
                        <option value="">保留</option>
                        <option value="">完了</option>
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
                <Td ref={aheadRef} backgroundColor={ahead.color}>
                    {ahead.text}
                </Td>
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
    background: ${(props) =>
        props.backgroundColor ? props.backgroundColor : "#fff"};
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
    width: ${(props) => (props.width ? props.width : "0%")};
    background: #ffc135;
`;

export default Task;
