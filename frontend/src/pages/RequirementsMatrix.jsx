import React from 'react';
import { useNavigate } from 'react-router-dom';

const RequirementsMatrix = () => {
  const navigate = useNavigate();
  
  const data = [
    { id: '1', assId: '1.1', desc: 'Manager Registration', need: 'Need administrators to manage and assign tasks', obj: 'Create Task Management System', by: 'Stakeholder', dept: 'Management', wbs: '1.1', spec: 'Finished', design: 'Finished', test: '1001' },
    { id: '1', assId: '1.2', desc: 'Manager Login', need: 'Secure access for managers to protect data', obj: 'Create Task Management System', by: 'Security Officer', dept: 'Management', wbs: '1.2', spec: 'Finished', design: 'Finished', test: '1002' },
    { id: '2', assId: '2.1', desc: 'Member Registration', need: 'Allow team members to join the system', obj: 'Create Task Management System', by: 'HR', dept: 'Operations', wbs: '2.1', spec: 'Finished', design: 'Finished', test: '2001' },
    { id: '2', assId: '2.2', desc: 'Member Login', need: 'Secure access for members to see work', obj: 'Create Task Management System', by: 'Security Officer', dept: 'Operations', wbs: '2.2', spec: 'Finished', design: 'Finished', test: '2002' },
    { id: '3', assId: '3.1', desc: 'Create Task', need: 'Core business requirement to define work', obj: 'Create Task Management System', by: 'Project Manager', dept: 'Management', wbs: '3.1', spec: 'Finished', design: 'Finished', test: '3001' },
    { id: '3', assId: '3.2', desc: 'Assign Task', need: 'Distribute workload effectively to members', obj: 'Create Task Management System', by: 'Project Manager', dept: 'Management', wbs: '3.2', spec: 'Finished', design: 'Finished', test: '3002' },
    { id: '4', assId: '4.1', desc: 'View All Tasks', need: 'Oversight of all operations and progress', obj: 'Create Task Management System', by: 'Project Manager', dept: 'Management', wbs: '4.1', spec: 'Finished', design: 'Finished', test: '4001' },
    { id: '4', assId: '4.2', desc: 'View Assigned Tasks', need: 'Members need to see their specific work', obj: 'Create Task Management System', by: 'Team Lead', dept: 'Operations', wbs: '4.2', spec: 'Finished', design: 'Finished', test: '4002' },
    { id: '5', assId: '5.1', desc: 'Update Task Status', need: 'Track progress of tasks through lifecycle', obj: 'Create Task Management System', by: 'Team Lead', dept: 'Operations', wbs: '5.1', spec: 'Finished', design: 'Finished', test: '5001' },
    { id: '6', assId: '6.1', desc: 'Deadline Validation', need: 'Prevent invalid deadlines (before start)', obj: 'Create Task Management System', by: 'Quality Assurance', dept: 'QA', wbs: '6.1', spec: 'Finished', design: 'Finished', test: '6001' },
    { id: '7', assId: '7.1', desc: 'Role-based Access Control', need: 'Enforce security boundaries between roles', obj: 'Create Task Management System', by: 'Security Officer', dept: 'IT', wbs: '7.1', spec: 'Finished', design: 'Finished', test: '7001' }
  ];

  return (
    <div className="page-card matrix-card">
      <div className="matrix-header-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="matrix-titles">
          <h1 className="matrix-main-title">Requirements Traceability Matrix Template</h1>
          <div className="matrix-subtitle"><span>Template Is In The Description (.xlsx)</span></div>
        </div>
        <div style={{width: '100px'}}></div>
      </div>
      
      <div className="table-responsive">
        <table className="rtm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ass. ID</th>
              <th>Requirements Description</th>
              <th>Business Need, Justification</th>
              <th>Project Objective</th>
              <th>Requested By</th>
              <th>Department</th>
              <th>WBS Element</th>
              <th>Specification</th>
              <th>Design</th>
              <th>Test Cases</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.id}</td>
                <td>{row.assId}</td>
                <td className="text-left">{row.desc}</td>
                <td className="text-left">{row.need}</td>
                <td>{row.obj}</td>
                <td>{row.by}</td>
                <td>{row.dept}</td>
                <td>{row.wbs}</td>
                <td>{row.spec}</td>
                <td>{row.design}</td>
                <td>{row.test}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequirementsMatrix;
