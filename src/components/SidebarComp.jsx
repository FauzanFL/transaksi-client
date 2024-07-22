/* eslint-disable react/prop-types */
import {
  CloseOutline,
  Conversion,
  Dashboard,
  ExpandOutline,
  Menu,
} from '@rsuite/icons';
import { useEffect, useState } from 'react';
import { IconButton, Nav, Sidebar, Sidenav, useMediaQuery } from 'rsuite';

const SidebarComp = ({ page }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState(page);
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [isMobile]);
  return (
    <>
      <Sidebar
        width={isMobile ? 56 : expanded ? 260 : 56}
        style={{
          transitionDuration: '200ms',
        }}
      >
        <div
          className={`fixed top-0 bottom-0 md:relative duration-200 flex flex-col z-30 ${
            expanded ? 'w-[260px]' : 'w-[56px]'
          } h-full whadow-md`}
        >
          <Sidenav
            expanded={expanded}
            appearance="inverse"
            style={{ width: '100%', height: '100%' }}
          >
            <div className="flex justify-end items-center mt-3 mx-2">
              <IconButton
                onClick={() => setExpanded(!expanded)}
                icon={
                  expanded ? (
                    <CloseOutline color="#000" />
                  ) : (
                    <Menu color="#000" />
                  )
                }
              />
            </div>
            <hr />
            <Sidenav.Body>
              <Nav activeKey={activeKey} onSelect={setActiveKey}>
                <Nav.Item
                  eventKey="dashboard"
                  icon={<Dashboard />}
                  href="/dashboard"
                >
                  Dashboard
                </Nav.Item>
                <Nav.Item
                  eventKey="transaction"
                  icon={<Conversion />}
                  href="/transactions"
                >
                  Transaksi
                </Nav.Item>
                <Nav.Item
                  eventKey="createTransaction"
                  icon={<ExpandOutline />}
                  href="/transactions/add"
                >
                  Buat Transaksi
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
            <Sidenav.Toggle onToggle={(expanded) => setExpanded(expanded)} />
          </Sidenav>
        </div>
      </Sidebar>
    </>
  );
};

export default SidebarComp;
