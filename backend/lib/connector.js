const connector = (msg) => {
  switch (msg.com[0]) {
    case 'neutral':
      return '';
    case 'takeoff':
      return 'takeoff';
    case 'disappear':
      return 'land';
    case 'push':
      return 'forward';
    case 'pull':
      return 'back';
    case 'lift':
      return 'up';
    case 'drop':
      return 'down';
    case 'left':
      return 'left';
    case 'right':
      return 'right';
    case 'rotateLeft':
      return '';
    case 'rotateRight':
      return '';
    case 'command':
      return 'command';
    default:
      return '';
  }
};

export default connector;
