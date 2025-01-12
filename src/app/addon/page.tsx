"use client";

import React, { useState } from 'react';
import styles from './addon.module.css';
import Ladder from './ladder/ladder'; // 사다리타기 컴포넌트 import

export default function AddOnPage() {
  const [selectedTool, setSelectedTool] = useState('ladder');

  const renderContent = () => {
    switch (selectedTool) {
      case 'ladder':
        return <Ladder />;
      // 다른 도구 컴포넌트 추가 가능
      default:
        return <div>기능을 선택해주세요.</div>;
    }
  };

  return (
    <div className={styles.addonContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Add-On</div>
        <div className={styles.divider}></div>
        <ul className={styles.menuList}>
          <li
            className={`${styles.menuItem} ${selectedTool === 'ladder' ? styles.selected : ''}`}
            onClick={() => setSelectedTool('ladder')}
          >
            사다리타기
          </li>
          <li className={styles.menuItem}>핀볼</li>
          <li className={styles.menuItem}>룰렛</li>
          <li className={styles.menuItem}>랜덤 팀 뽑기</li>
          <li className={styles.menuItem}>메모장</li>
          <li className={styles.menuItem}>타이머</li>
          <li className={styles.menuItem}>주사위 굴리기</li>
          <li className={styles.menuItem}>Yes or No</li>
        </ul>
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}
