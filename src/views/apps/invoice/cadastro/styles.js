import styled from "styled-components";

export const ContainerAvatar = styled.div`
  align-self: center;
  margin-bottom: 30px;
  label {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
    img {
      height: 120px;
      width: 120px;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.3);
      background: #eee;
    }
    .foto {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-top: 25px;
      height: 120px;
      width: 120px;
      border-radius: 50%;
      border: 2px dashed rgba(0, 0, 0, 0.15);
      background: #fff;
      color: rgba(0, 0, 0, 0.15);
    }
    .nome {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-top: 25px;
      height: 120px;
      width: 120px;
      border-radius: 50%;
      background: plum;
      color: white;
      font-size: 3.5em;
      text-align: center;
    }
    input {
      display: none;
    }
  }
`;
export const Container = styled.div`
  height: 900px;
  width: 1000px;
`;
