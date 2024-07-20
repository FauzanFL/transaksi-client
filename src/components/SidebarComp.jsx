/* eslint-disable react/prop-types */
import { Conversion, Dashboard, ExpandOutline } from '@rsuite/icons';
import { useState } from 'react';
import { Nav, Sidebar, Sidenav, Toggle } from 'rsuite';

const SidebarComp = ({ page }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState(page);
  return (
    <>
      <Sidebar
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        width={expanded ? 260 : 56}
        className="shadow-md"
        collapsible
      >
        <Sidenav
          expanded={expanded}
          appearance="inverse"
          style={{ width: '100%', height: '100%' }}
        >
          <div className="flex justify-end items-center mt-3">
            <Toggle
              color="violet"
              onChange={setExpanded}
              style={{ marginRight: 7 }}
              checked={expanded}
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
      </Sidebar>
    </>
  );
};

export default SidebarComp;
