package socket

const (
	PLAYER_JOINED         = "playerJoined"
	PLAYER_LEFT           = "playerLeft"
	PLAYER_HAS_MOVED      = "playerHasMoved"
	PLAYER_MOVEMENT_UP    = "playerMovementUp"
	PLAYER_MOVEMENT_DOWN  = "playerMovementDown"
	PLAYER_MOVEMENT_LEFT  = "playerMovementLeft"
	PLAYER_MOVEMENT_RIGHT = "playerMovementRight"
)

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}
