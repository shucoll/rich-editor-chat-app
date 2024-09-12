import './Loader.css';

const Loader = ({ size, center }) => {

  let styles;

  if (!size) {
    size = '35px';
  }

  if(center) { 
    styles = {
      margin: '0 auto',
    };
  }

  styles = {
    ...styles,
    width: size,
  };

  return <div className='loader' style={styles}></div>;
};

export default Loader;
