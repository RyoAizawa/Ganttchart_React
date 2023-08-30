import React, { useState, useEffect, useRef } from "react";
import { styled } from "styled-components";

// eslint-disable-next-line react/display-name
const ModalWindow = React.memo((props) => {
    let title = "";
    let btnText = "";
    if (props.process === "edit") {
        title = "編集";
        btnText = "更新";
    } else {
        title = "新規追加";
        btnText = "追加";
    }
    const [isClose, setIsClose] = useState(false);
    const [progress, setProgress] = useState(0);
    const [formData, setFormData] = useState({
        id: 0,
        title: "",
        name: "",
        progress: 0,
        status: "",
        startDatePlan: "",
        endDatePlan: "",
        startDateAct: "",
        endDateAct: "",
    });
    const [errors, setErrors] = useState({
        flag: false,
        title: "",
        name: "",
        startDatePlan: "",
        endDatePlan: "",
    });
    const titleRef = useRef();
    const nameRef = useRef();
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
        if (props.process === "edit") {
            setFormData({
                ...formData,
                id: props.editContent.id,
                title: props.editContent.title,
                name: props.editContent.name,
                progress: props.editContent.progress,
                status: props.editContent.status,
                startDatePlan: props.editContent.startDatePlan,
                endDatePlan: props.editContent.endDatePlan,
                startDateAct: props.editContent.startDateAct,
                endDateAct: props.editContent.endDateAct,
            });
            setProgress(props.editContent.progBarValue);
            progBarRef.current.value = props.editContent.progBarValue;
            startDatePlanRef.current.value = props.editContent.startDatePlan;
            endDatePlanRef.current.value = props.editContent.endDatePlan;
            startDateActRef.current.value = props.editContent.startDateAct;
            endDateActRef.current.value = props.editContent.endDateAct;
            selectRef.current.value = props.editContent.status;
        } else {
            progBarRef.current.value = 0;
        }
    };

    const show = () => {
        setIsClose(false);
    };

    const close = (process) => {
        setIsClose(true);
        props.handleClose(process);
    };

    const setProgBarVal = () => {
        setProgress(progBarRef.current.value);
    };

    const changeStartDate = (process) => {
        if (process === "plan") {
            endDatePlanRef.current.setAttribute(
                "min",
                startDatePlanRef.current.value
            );
        } else {
            endDateActRef.current.setAttribute(
                "min",
                startDateActRef.current.value
            );
        }
    };

    // タスクを更新/追加する関数
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

        e.preventDefault();
        if (!validate(data)) return false;

        if (props.process === "edit") {
            if (confirm(`タスクの内容を更新しますか？`)) {
                try {
                    await props.useFetch.post(`/api/update/${id}`, data);
                    window.location.reload();
                } catch (error) {
                    console.error("Error update task:", error);
                }
            }
        } else {
            try {
                await props.useFetch.post(`/api/insert/`, data);
                window.location.reload();
            } catch (error) {
                console.error("Error insert task:", error);
            }
        }
    };

    const validate = (data) => {
        let error = false;
        let titleError = "";
        let nameError = "";
        let startDatePlanError = "";
        let endDatePlanError = "";

        if (data.title === "") {
            error = true;
            titleError = "タイトルを入力してください";
        }
        if (data.name === "") {
            error = true;
            nameError = "担当者名を入力してください";
        }
        if (data.startDatePlan === "") {
            error = true;
            startDatePlanError = "開始予定日を入力してください";
        }
        if (data.endDatePlan === "") {
            error = true;
            endDatePlanError = "終了予定日を入力してください";
        }
        setErrors({
            ...errors,
            flag: error,
            title: titleError,
            name: nameError,
            startDatePlan: startDatePlanError,
            endDatePlan: endDatePlanError,
        });
        if (error) return false;
        return true;
    };

    return (
        <>
            <StyledModalWindow
                $isShow={props.isShow}
                $isClose={isClose}
                className={props.isShow ? "fadeIn" : ""}
            >
                <Overlay onClick={() => close(props.process)} />
                <ContentWrapper className={props.isShow ? "fall" : ""}>
                    <Content>
                        <Button onClick={() => close(props.process)}>✖</Button>
                        <Title>{title}</Title>
                        <Form onSubmit={(e) => handleSubmit(e, formData.id)}>
                            <PItem>タイトル</PItem>
                            <Error>{errors.title}</Error>
                            <FormInputText
                                ref={titleRef}
                                type="text"
                                name="title"
                                defaultValue={formData.title}
                            />
                            <PItem>担当者</PItem>
                            <Error>{errors.name}</Error>
                            <FormInputText
                                ref={nameRef}
                                type="text"
                                name="name"
                                defaultValue={formData.name}
                            />
                            <FlexArea>
                                <div>
                                    <PItem>進捗率</PItem>
                                    <Progress>{progress}%</Progress>
                                    <FormInput
                                        type="range"
                                        ref={progBarRef}
                                        name="progress"
                                        step="10"
                                        min="0"
                                        max="100"
                                        defaultValue={formData.progBarValue}
                                        onChange={() => setProgBarVal()}
                                    />
                                </div>
                                <div>
                                    <PItem>状況</PItem>
                                    <FormInputSelect
                                        ref={selectRef}
                                        name="status"
                                        defaultValue={formData.status}
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
                                    <Error>{errors.startDatePlan}</Error>
                                    <FormInput
                                        type="date"
                                        name="startDatePlan"
                                        ref={startDatePlanRef}
                                        defaultValue={formData.startDatePlan}
                                        onChange={() => changeStartDate("plan")}
                                    />
                                </div>
                                <div>
                                    <PItem>終了予定日</PItem>
                                    <Error>{errors.endDatePlan}</Error>
                                    <FormInput
                                        type="date"
                                        name="endDatePlan"
                                        ref={endDatePlanRef}
                                        min={formData.startDatePlan}
                                        defaultValue={formData.endDatePlan}
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
                                        defaultValue={formData.startDateAct}
                                        onChange={() => changeStartDate("act")}
                                    />
                                </div>
                                <div>
                                    <PItem>終了実績日</PItem>
                                    <FormInput
                                        type="date"
                                        name="endDateAct"
                                        ref={endDateActRef}
                                        min={formData.startDateAct}
                                        defaultValue={formData.endDateAct}
                                    />
                                </div>
                            </FlexArea>
                            <Submit>
                                <button type="submit">{btnText}</button>
                            </Submit>
                        </Form>
                    </Content>
                </ContentWrapper>
            </StyledModalWindow>
        </>
    );
});

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
    z-index: 9;
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
    font-size: 3rem;
    margin-bottom: 30px;
`;

const Form = styled.form`
    padding: 0 20px;
`;

const PItem = styled.p`
    font-weight: bold;
    font-size: 1.8rem;
    padding: 20px 0 15px 0px;
`;

const FormInputText = styled.input`
    box-sizing: border-box;
    font-size: 1.6rem;
    height: 35px;
    width: 100%;
`;

const Progress = styled.p`
    font-size: 1.6rem;
`;

const FormInputSelect = styled.select`
    box-sizing: border-box;
    font-size: 1.6rem;
    height: 35px;
    width: 100%;
`;

const FormInput = styled.input`
    width: 100%;
    font-size: 1.6rem;
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
        font-size: 2rem;
        padding: 5px 15px;
        background-color: #2057fe;
        color: #fff;
        border: none;
        border-radius: 8px;
    }
`;

const Error = styled.span`
    font-size: 1.6rem;
    color: red;
`;
export default ModalWindow;
