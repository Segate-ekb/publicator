import React from 'react';
import Bases from './Bases';
import Publications from './Publications';
import ExportJson from './ExportJson';
import { useBasesData } from './DataContext';
import styles from './css/Content.module.css';
import SelectedIndexContext from './SelectedIndexContext';

function Content(props) {
  const { jsonData, basesData  } = useBasesData();
  const { handleDrawerToggle, mobileOpen } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  if (!basesData) {
    return <div>Загружается...</div>;
  }

  return (
    <div>
      <div className={styles.container}>
        <Bases handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} setSelectedIndex={setSelectedIndex} />
        <div className={styles.innerContainer}>
          <SelectedIndexContext.Provider value={selectedIndex}>
            <div className={styles.publicationsContainer}>
              <Publications />
            </div>
          </SelectedIndexContext.Provider>
          <div className={styles.exportJsonContainer}>
            <div className={styles.exportJsonButton}>
              {/* <ExportJson data={jsonData} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;