import { useState, useEffect, useRef } from "react";
import { styled } from "styled-components";

const ModalWindow = (props) => {
    const [isClose, setIsClose] = useState(false);
    const [progress, setProgress] = useState();

    const startDatePlanRef = useRef();
    const endDatePlanRef = useRef();
    const startDateActRef = useRef();
    const endDateActRef = useRef();
    const progBarRef = useRef();
    const selectRef = useRef();

    useEffect(() => {
        initParam();
        show();
    }, [props.isShow]);

    const initParam = () => {
        setProgress(props.editContent.progBarValue);
        progBarRef.current.value = props.editContent.progBarValue;
        startDatePlanRef.current.value = props.editContent.startDatePlan;
        endDatePlanRef.current.value = props.editContent.endDatePlan;
        startDateActRef.current.value = props.editContent.startDateAct;
        endDateActRef.current.value = props.editContent.endDateAct;
        selectRef.current.value = props.editContent.status;
    };

    const show = () => {
        setIsClose(false);
    };

    const close = () => {
        setIsClose(true);
        props.handleClose();
    };

    const setProgBarVal = () => {
        setProgress(progBarRef.current.value);
    };

    const changeStartDate = (process) => {
        if (process === "plan") {
            endDatePlanRef.current.setAttribute("min", startDatePlanRef.current.value);
        } else {
            endDateActRef.current.setAttribute("min", startDateActRef.current.value);
        }
    };

    // タスクを更新する関数
    const handleSubmit = async (e, id) => {
        const data = {};
        data.title = e.target.querySelector("input[name='title']").value;
        data.name = e.target.querySelector("input[name='name']").value;
        data.progress = e.target.querySelector("input[name='progress']").value;
        data.status = e.target.querySelector("select[name='status']").value;
        data.startDatePlan = e.target.querySelector(
            "input[name='startDatePlan']"
        ).value;
        data.endDatePlan = e.target.querySelector(
            "input[name='endDatePlan']"
        ).value;
        data.startDateAct = e.target.querySelector(
            "input[name='startDateAct']"
        ).value;
        data.endDateAct = e.target.querySelector(
            "input[name='endDateAct']"
        ).value;

        console.log(data);
        e.preventDefault();

        if (confirm(`タスクの内容を更新しますか？`)) {
            try {
                await props.useFetch.post(`/api/update/${id}`, data);
                window.location.reload();
            } catch (error) {
                console.error("Error update task:", error);
            }
        }
    };

    return (
        <>
            <StyledModalWindow
                $isShow={props.isShow}
                $isClose={isClose}
                className={props.isShow ? "fadeIn" : "f"}
            >
                <Overlay onClick={() => close()} />
                <ContentWrapper className={props.isShow ? "fall" : ""}>
                    <Content>
                        <Button onClick={() => close()}>✖</Button>
                        <Title>編集</Title>
                        <Form
                            onSubmit={(e) =>
                                handleSubmit(e, props.editContent.id)
                            }
                        >
                            <PItem>タイトル</PItem>
                            <FormInputText
                                type="text"
                                name="title"
                                defaultValue={props.editContent.title}
                            />
                            <PItem>担当者</PItem>
                            <FormInputText
                                type="text"
                                name="name"
                                defaultValue={props.editContent.name}
                            />

                            <FlexArea>
                                <div>
                                    <PItem>進捗率</PItem>
                                    <p>{progress}%</p>
                                    <FormInput
                                        type="range"
                                        ref={progBarRef}
                                        name="progress"
                                        step="10"
                                        min="0"
                                        max="100"
                                        defaultValue={
                                            props.editContent.progBarValue
                                        }
                                        onChange={() => setProgBarVal()}
                                    />
                                </div>
                                <div>
                                    <PItem>状況</PItem>
                                    <FormInputSelect
                                        ref={selectRef}
                                        name="status"
                                        defaultValue={props.editContent.status}
                                    >
                                        <option value="未着手">未着手</option>
                                        <option value="進行中">進行中</option>
                                        <option value="保留">保留</option>
                                        <option value="完了">完了</option>
                                    </FormInputSelect>
                                </div>
                            </FlexArea>
                            <FlexArea>
                                <div>
                                    <PItem>開始予定日</PItem>
                                    <FormInput
                                        type="date"
                                        name="startDatePlan"
                                        ref={startDatePlanRef}
                                        defaultValue={
                                            props.editContent.startDatePlan
                                        }
                                        onChange={() => changeStartDate("plan")}
                                    />
                                </div>
                                <div>
                                    <PItem>終了予定日</PItem>
                                    <FormInput
                                        type="date"
                                        name="endDatePlan"
                                        ref={endDatePlanRef}
                                        min={props.editContent.startDatePlan}
                                        defaultValue={
                                            props.editContent.endDatePlan
                                        }
                                    />
                                </div>
                            </FlexArea>
                            <FlexArea>
                                <div>
                                    <PItem>開始実績日</PItem>
                                    <FormInput
                                        type="date"
                                        name="startDateAct"
                                        ref={startDateActRef}
                                        defaultValue={
                                            props.editContent.startDateAct
                                        }
                                        onChange={() => changeStartDate("act")}
                                    />

                                </div>
                                <div>
                                    <PItem>終了実績日</PItem>
                                    <FormInput
                                        type="date"
                                        name="endDateAct"
                                        ref={endDateActRef}
                                        min={props.editContent.startDateAct}
                                        defaultValue={
                                            props.editContent.endDateAct
                                        }
                                    />
                                </div>
                            </FlexArea>
                            <Submit>
                                <button type="submit">更新</button>
                            </Submit>
                        </Form>
                    </Content>
                </ContentWrapper>
            </StyledModalWindow>
        </>
    );
};

const StyledModalWindow = styled.div`
    ${({ $isClose, $isShow }) =>
        $isClose
            ? `visibility: hidden;`
            : $isShow
            ? `visibility: visible;`
            : `visibility: hidden;`}
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    &.fadeIn {
        animation: fadeIn 0.3s;
    }
`;

const Overlay = styled.div`
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: -100vh;
    left: -100vw;
    bottom: -100vh;
    right: -100vw;
    transform: translateY(50px);
    z-index: 2;
`;

const ContentWrapper = styled.div`
    display: flex;
    background-color: white;
    border-radius: 8vmin;
    justify-content: center;
    align-items: center;
    min-height: 50vmin;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 80vmin;
    z-index: 10;
    padding: 40px;
    > button {
        position: absolute;
        top: 4vmin;
        right: 4vmin;
    }

    @keyframes fall {
        from {
            top: 40%;
        }
        to {
            top: 50%;
        }
    }
    &.fall {
        animation: fall 0.4s;
    }
`;

const Content = styled.div`
    max-height: 100vmin;
    width: 100%;
`;

const Button = styled.button`
    position: absolute;
    top: 30px;
    right: 30px;
    cursor: pointer;
    padding: 15px;
    background: #e9767a;
    color: #fff;
    border-radius: 50%;
    line-height: 14px;
    font-weight: bold;
    border: none;
`;

const Title = styled.h2`
    font-size: 2rem;
    margin-bottom: 30px;
`;

const Form = styled.form`
    padding: 0 20px;
`;

const PItem = styled.p`
    font-weight: bold;
    font-size: 1.2rem;
    padding: 20px 0 15px 0px;
`;

const FormInputText = styled.input`
    box-sizing: border-box;
    font-size: 1.2rem;
    height: 35px;
    width: 100%;
`;

const FormInputSelect = styled.select`
    box-sizing: border-box;
    font-size: 1.2rem;
    height: 35px;
    width: 100%;
`;

const FormInput = styled.input`
    width: 100%;
    font-size: 1rem;
    height: 35px;
`;
const FlexArea = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    > div {
        width: 50%;
    }
`;

const Submit = styled.p`
    text-align: center;
    margin-top: 30px;
    > button {
        font-size: 1.2rem;
        padding: 5px 15px;
        background-color: #2057fe;
        color: #fff;
        border: none;
        border-radius: 8px;
    }
`;

export default ModalWindow;
