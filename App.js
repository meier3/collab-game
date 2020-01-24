import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableHighlight, Image } from 'react-native';

const _grid = [
  [1, 0, 0, 0],
  [1, 1, 1, 0],
  [1, 1, 1, 0],
  [1, 1, 1, 3]
]


class GridSquare extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    var img;
    switch (this.props.type) {
      case 0:
        break;
      case 1:
        img = require("./assets/Obstacle.png");
        break;
      case 2:
        img = require("./assets/FrogMan.png");
        break;
      case 3:
        img = require("./assets/End.png");
        break;
    }
    return (
      <View style={styles.square}>
        <Image style={styles.gridImage} resizeMode='contain' source={img} />
      </View>
    )
  }
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      player_num: 1,
      waiting: false,
      grid: this.props.mainGrid,
      spritePos: this.props.startPos,
    };
  }

  componentDidMount() {
    this.updateGrid();
  }

  isValidMove(pos) {
    let r = pos[0], c = pos[1];
    let gridW = this.state.grid[0].length - 1;
    let gridH = this.state.grid.length - 1;
    
    // check out-of-bounds
    if ((r < 0) || (c < 0) || (r > gridH) || (c > gridW)) {
      console.log("out of bounds!")
      return false;
    }
    // check obstacles
    else if (this.state.grid[r][c] == 1) {
      console.log("obstacle!")
      return false;
    }
    else {
      console.log("valid move!")
      return true;
    }
  }

  leftPress = () => {
    // console.log('left press');
    let pos = this.state.spritePos;

    // if (this.state.player_num == 1) {
    let newPos = [pos[0], pos[1] - 1];

    if (this.isValidMove(newPos)) {
      this.updateSprite(newPos);
    }
    // }
  };

  middlePress = () => { };

  rightPress = () => {
    let pos = this.state.spritePos;
    // this.updateSprite([pos[0], pos[1] + 1])
    let newPos = [pos[0], pos[1] + 1];

    if (this.isValidMove(newPos)) {
      this.updateSprite(newPos);
    }
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


  button_left = function (options) {
    if (this.state.player_num == 1) {
      return {
        transform: [{ rotate: '180deg' }],
        flex: 1,
      }
    }
    else {
      return {
        transform: [{ rotate: '90deg' }],
        flex: 1,
      }
    }
  }
  button_right = function (options) {
    if (this.state.player_num == 1) {
      return {
        flex: 1,
      }
    }
    else {
      return {
        transform: [{ rotate: '270deg' }],
        flex: 1,
      }
    }
  }

  opacity = function (options) {
    if (this.state.waiting) {
      return {
        opacity: .3,
        flex: 1,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 2,
      }
    }
    else {
      return {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 2,
      }
    }
  }

  popupBox = function (options) {
    if (this.state.waiting) {
      return {
        opacity: 1,
        zIndex: 10,
        position: "absolute",
        height: "30%",
        width: "30%",
        alignSelf: "center",
        backgroundColor: "green"
      }
    }
    else {
      return {
        opacity: 0,
      }
    }
  }

  render() {
    return (

      <View style={styles.body}>
        <View style={this.popupBox()}>
          <Text> Waiting for other player. (Switch with waiting image later) </Text>
        </View>

        <View style={styles.gameview}>
          {this.renderGrid()}
        </View>

        <View style={styles.controls}>
          <TouchableHighlight style={styles.button} onPress={this.leftPress}>
            <View style={this.opacity()}>
              <Image style={this.button_left()} resizeMode='contain' source={require("./assets/rightarrow.png")} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button} onPress={this.middlePress}>
            <View style={this.opacity()}>
              <Image style={styles.skip} resizeMode='contain' source={require("./assets/button.png")} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button} onPress={this.rightPress}>
            <View style={this.opacity()}>
              <Image style={this.button_right()} resizeMode='contain' source={require("./assets/rightarrow.png")} />
            </View>
          </TouchableHighlight>
        </View>

      </View>
    );
  }
}

App.defaultProps = {
  // 0 = empty, 1 = obstacle, 2 = sprite, 3 = final
  mainGrid: _grid,
  startPos: [0, 1],
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
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  button: {
    flex: 1,
    backgroundColor: 'gray',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 2,
  },
  gridImage: {
    backgroundColor: "white",
    flex: 1
  },
  skip: {
    flex: 1,
  },
});

export default App;