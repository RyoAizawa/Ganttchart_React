import styled from "styled-components";

export const GlobalHeader = (props) => {
    const handleClick = (process) => {
        if (process === "up") {
            props.setIndent(props.indent++);
        } else if (process === "down") {
            props.setIndent(props.indent--);
        }
    };

    return (
        <>
            <Header>
                <Wrapper>
                    <Button onClick={() => handleClick("up")}>&lt;</Button>
                    <Button onClick={() => handleClick("down")}>&gt;</Button>
                </Wrapper>
            </Header>
        </>
    );
};

const Header = styled.header`
    background: #959595;
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
`;

const Wrapper = styled.div`
    display: flex;
    gap: 20px;
    padding-left: 20px;
`;

const Button = styled.button`
    display: block;
    border-radius: 5px;
    padding: 5px 20px;
`;
export default GlobalHeader;
