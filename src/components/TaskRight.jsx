import styled from "styled-components";

export const TaskRight = (props) => {

    





    // // 予定、実績にセットされた日付けの差分を計算
    // const startDate = new Date(props.stDate);
    // const endDate = new Date(props.edDate);
    // const diffTime = endDate.getTime() - startDate.getTime();
    // let diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    // // マイナス値になった場合は0を設定しておく
    // if (diffDay < 0) diffDay = 0;
    // return diffDay;

    return (
        <>
            <tr>
                {(function () {
                    let colDays = [];
                    for (let i = 0; i < props.columnsValue; i++) {
                        colDays.push(<Td key={i} className="col_day"></Td>);
                    }
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
    height: 50px;
`;

const PlanBar = styled.div`
    top: 4px;
    height: 19px;
    background: #93bef3;
    z-index: 1;
`;

const actBar = styled.div`
    top: 17px;
    height: 5px;
    background-color: blue;
    border: none;
    z-index: 2;
`;

export default TaskRight;
