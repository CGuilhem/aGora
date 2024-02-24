package socket

type Message struct {
	Type string `json:"type"`
	Data struct {
		Position struct {
			X int `json:"x"`
			Y int `json:"y"`
		} `json:"position"`
	} `json:"data"`
}

var PLAYER_MOVEMENT_UP = "playerMovementUp"
var PLAYER_MOVEMENT_DOWN = "playerMovementDown"
var PLAYER_MOVEMENT_LEFT = "playerMovementLeft"
var PLAYER_MOVEMENT_RIGHT = "playerMovementRight"