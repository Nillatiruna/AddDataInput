import { useMemo, useState } from 'react';
import { ReactComponent as WarningIcon } from '../../img/ui/warning_icon.svg';
import { ReactComponent as ConfirmIcon } from '../../img/ui/confirm_icon.svg';
import { ReactComponent as AddIcon } from '../../img/ui/add_icon.svg';
import { ReactComponent as RemoveIcon } from '../../img/ui/remove_icon.svg';
import { ReactComponent as CleanIcon } from '../../img/ui/clean_icon.svg';
import classes from './AddDataInput.module.css';
import { accentColor, alertMessages } from '../../utils/constants';
import { DataLoader } from '../Loaders/Loaders';

export const AddDataInput = ({
  placeholder,
  value,
  setValue,
  hasLoader,
  setAlert
}) => {
  const initValue = useMemo(() => (value ? value.split(',') : []), [value]);
  const [text, setText] = useState('');
  const [isActive, setActive] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const showLoader = useMemo(() => hasLoader && loading, [hasLoader, loading]);

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onClick = () => {
    setActive(true);
  };

  const removeValue = async () => {
    setLoading(true);
    const res = await setValue(
      initValue.filter((v, i) => i !== editIndex).join(',')
    );

    if (res) {
      setText('');
      setActive(false);
      setEditIndex(null);
    } else if (setAlert) {
      setAlert(alertMessages.somethingWrong, 'error');
    }
    setLoading(false);
  };
  const addValue = async () => {
    if (!text) {
      setActive(false);
      return;
    }
    let res = null;
    if (editIndex !== null) {
      if (initValue.includes(text)) {
        setActive(false);
        return;
      }
      setLoading(true);
      res = await setValue(
        initValue.map((v, i) => (i === editIndex ? text : v)).join(',')
      );
    } else {
      setLoading(true);
      res = await setValue(initValue.concat(text).join(','));
    }
    if (res) {
      setText('');
      setActive(false);
      setEditIndex(null);
    } else if (setAlert) {
      setAlert(alertMessages.somethingWrong, 'error');
    }
    setLoading(false);
  };

  const addMore = () => {
    setText('');
    setActive(true);
    setEditIndex(null);
  };

  const clearText = () => {
    setText('');
    setActive(false);
  };
  const changeValue = (v, i) => {
    setText(v);
    setActive(true);
    setEditIndex(i);
  };

  return (
    <div className={classes.container}>
      <div
        className={`${classes.valueBox} ${
          value && !isActive ? classes.valueBoxActive : ''
        }`}
      >
        <ul>
          {initValue.map((v, i) => (
            <li
              key={`data-row-${i}`}
              className={classes.valueLine}
              onClick={() => changeValue(v, i)}
            >
              {v}
            </li>
          ))}
        </ul>
        {initValue.length === 1 && (
          <AddIcon
            className={`${classes.activeIcon} ${classes.confirmIcon}`}
            onClick={addMore}
          />
        )}
      </div>
      <div
        className={`${classes.dataInputContainer} ${
          isActive || !value ? classes.dataInputContainerActive : ''
        }`}
      >
        <div
          className={`${classes.dataInputBox} ${
            isActive ? classes.dataInputBoxActive : ''
          }`}
        >
          <input
            value={text}
            className={classes.dataInput}
            onChange={onChange}
            onClick={onClick}
            placeholder={placeholder}
          />
          {isActive ? (
            editIndex !== null ? (
              <div className={classes.activeIconsBox}>
                <ConfirmIcon
                  className={`${classes.activeIcon} ${classes.confirmIcon}`}
                  onClick={addValue}
                />
                <RemoveIcon
                  className={`${classes.activeIcon} ${classes.removeIcon}`}
                  onClick={removeValue}
                />
              </div>
            ) : (
              <div className={classes.activeIconsBox}>
                <AddIcon
                  className={`${classes.activeIcon} ${classes.confirmIcon}`}
                  onClick={addValue}
                />
                <CleanIcon onClick={clearText} className={classes.activeIcon} />
              </div>
            )
          ) : (
            <WarningIcon className={classes.inactiveIcon} />
          )}
        </div>
        {showLoader && (
          <div className={classes.loaderBox}>
            <DataLoader size="20px" color={accentColor} />
          </div>
        )}
      </div>
    </div>
  );
};
