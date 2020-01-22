import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

const _grid = [
  [0, 0, 0, 0],
  [1, 1, 1, 0],
  [1, 1, 1, 0],
  [1, 1, 1, 3]
]


class GridSquare extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.square}>
        <Text>{this.props.type}</Text>
      </View>
    )
  }
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      grid: this.props.mainGrid,
      spritePos: this.props.startPos,
    };
  }

  componentDidMount() {
    this.updateGrid();
  }

  leftPress = () => {
    let pos = this.state.spritePos;
    this.updateSprite([pos[0], pos[1] - 1])
  };

  middlePress = () => { };

  rightPress = () => {
    let pos = this.state.spritePos;
    this.updateSprite([pos[0], pos[1] + 1])
  };

  updateSprite(pos) {
    this.setState({ spritePos: pos });

    // setState is async, this timeout lets it finish before rendering
    setTimeout(() => {
      this.updateGrid();
    }, 0);
  };

  updateGrid() {
    // deep copy blank grid
    let newGrid = JSON.parse(JSON.stringify(_grid));
    // add sprite
    let pos = this.state.spritePos;
    newGrid[pos[0]][pos[1]] = 2;
    // update the grid
    this.setState({ grid: newGrid })
  };

  renderGrid() {
    let output = [];
    let grid = this.state.grid;
    let squareCounter = 0;
    let rowCounter = 0;

    // iterate through grid data, create GridSquares accordingly
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      let content = [];

      for (let j = 0; j < row.length; j++) {
        const squareVal = row[j];
        content.push(<GridSquare type={squareVal} key={squareCounter} />);
        squareCounter++;
      }
      output.push(<View style={styles.row} key={rowCounter}>{content}</View>);
      rowCounter++;
    }

    return output;
  }

  render() {
    return (
      <View style={styles.body}>

        <View style={styles.gameview}>
          {this.renderGrid()}
        </View>

        <View style={styles.controls}>
          <TouchableHighlight style={styles.button} onPress={this.leftPress}>
            <View style={styles.row} />
          </TouchableHighlight>

          <TouchableHighlight style={styles.button} onPress={this.middlePress}>
            <View style={styles.row} />
          </TouchableHighlight>

          <TouchableHighlight style={styles.button} onPress={this.rightPress}>
            <View style={styles.row} />
          </TouchableHighlight>
        </View>

      </View>
    );
  }
}

App.defaultProps = {
  // 0 = empty, 1 = obstacle, 2 = sprite, 3 = final
  mainGrid: _grid,
  startPos: [0, 0],
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameview: {
    flex: 4,
    alignSelf: 'stretch',
    borderColor: 'red',
    borderWidth: 2,
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderColor: 'blue',
    borderWidth: 2,
  },
  button: {
    flex: 1,
    backgroundColor: 'gray',

  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
  },
  square: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 2,
  },
});

export default App;