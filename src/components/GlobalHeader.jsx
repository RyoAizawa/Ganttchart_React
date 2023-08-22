import styled from "styled-components";

export const GlobalHeader = (props) => {

    return (
        <>
            <Header>
                <Wrapper>
                    <Button onClick={() => props.handleClick("down")}>&lt;</Button>
                    <Button onClick={() => props.handleClick("up")}>&gt;</Button>
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
