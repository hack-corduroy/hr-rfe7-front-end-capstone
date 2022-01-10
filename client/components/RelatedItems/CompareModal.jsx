import React from 'react';
import styled from 'styled-components';

var CompareModal = ({ related, current }) => {
  let currentFeatures = current ? current.features || [] : [];
  let relatedFeatures = related ? related.features || [] : [];

  let features = [];

  currentFeatures.forEach((x) => {
    if (x.value && x.value !== 'null') {
      features.push(x.feature);
    }
  });
  relatedFeatures.forEach((x) => {
    if (x.value && x.value !== 'null' && !features.includes(x.feature)) {
      features.push(x.feature);
    }
  });

  let currentDisplay = {};
  let relatedDisplay = {};
  currentFeatures.forEach((x) => (currentDisplay[x.feature] = '✓   ' + x.value));
  relatedFeatures.forEach((x) => (relatedDisplay[x.feature] = x.value + '   ✓'));

  return (
    <Container>
      <h1>Comparing</h1>
      <Header>
        <h2>{current.name}</h2>
        <h2>{related.name}</h2>
      </Header>
      <Table>
        <tbody>
          {features.map((x, i) => (
            <tr key={i}>
              <td>{currentDisplay[x] || ''}</td>
              <td>{x}</td>
              <td>{relatedDisplay[x] || ''}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px 40px;
  color: ${(props) => props.theme.textLight} h1, h2 {
    margin: 0px;
    padding: 5px;
  }
  h1 {
    font-size: 0.7em;
    font-weight: normal;
    text-transform: uppercase;
  }
  h2 {
    font-size: 0.9em;
    font-weight: bold;
  }
`;

const Header = styled.div`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  color: ${(props) => props.theme.textDark};
`;

const Table = styled.table`
  width: 100%;
  font-size: 0.8em;
  border-collapse: collapse;
  margin-top: 10px;
  color: ${(props) => props.theme.textLight};
  td {
    width: 33%;
    padding: 8px 0px;
    text-align: center;
    border-bottom: 1px solid ${(props) => props.theme.bgDark};
  }
  tr td:first-child {
    text-align: left;
  }
  tr td:last-child {
    text-align: right;
  }

  tr:last-child td {
    border: 0px;
  }
`;

export default CompareModal;
