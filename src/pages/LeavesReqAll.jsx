import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Select,
  MenuItem,
  Button,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import { CSVLink } from 'react-csv';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import DeleteIcon from '@mui/icons-material/Delete';

const LeavesReq = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, userId } = location.state || {};
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [recordCount, setRecordCount] = useState(10);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const q = query(collection(db, 'leaveRequests'));
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeaveRequests(requests);
      setFilteredRequests(requests.slice(0, recordCount));
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes de congé :", error);
    }
  };

  const handleOrganizationChange = (e) => {
    const selectedOrganization = e.target.value;
    setOrganizationFilter(selectedOrganization);
    filterLeaveRequests(selectedOrganization, recordCount);
  };

  const handleRecordCountChange = (e) => {
    const selectedCount = e.target.value;
    setRecordCount(selectedCount);
    filterLeaveRequests(organizationFilter, selectedCount);
  };

  const filterLeaveRequests = (organization, count) => {
    let filtered = leaveRequests;
    if (organization) {
      filtered = leaveRequests.filter(
        (request) => request.organizationID === organization
      );
    }
    setFilteredRequests(filtered.slice(0, count));
  };

  useEffect(() => {
    const dataToExport = filteredRequests.map((request) => ({
      FullName: request.fullName,
      LeaveType: request.leaveType,
      StartDate: request.startDate?.toDate().toLocaleDateString(),
      EndDate: request.endDate?.toDate().toLocaleDateString(),
      Reason: request.reason,
      Status: request.Status === 1 ?
        "Approuvé" : "En attente",
      HodStatus: request.HodStatus === 1 ?
        "Approuvé" : "En attente",
      HrStatus: request.HrStatus === 1 ?
        "Approuvé" : "En attente",
      CeoStatus: request.CeoStatus === 1 ?
        "Approuvé" : "En attente",
      Organization: request.organizationID,
      CreatedBy: request.createdBy,
      CreatedAt: request.createdAt?.toDate().toLocaleString(),
    }));
    setExportData(dataToExport);
  }, [filteredRequests]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'leaveRequests', id));
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error deleting leave request:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <FormControl style={{ marginRight: '20px', minWidth: '200px' }}>
          <p>Organisation</p>
          <Select
            value={organizationFilter}
            onChange={handleOrganizationChange}
            displayEmpty
          >
            <MenuItem value="">Toutes les organisations</MenuItem>
            {[...new Set(leaveRequests.map((req) => req.organizationID))].map(
              (organization, index) => (
                <MenuItem key={index} value={organization}>
                  {organization}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <FormControl style={{ marginRight: '20px', minWidth: '100px' }}>
          <p>Enregistrements</p>
          <Select
            value={recordCount}
            onChange={handleRecordCountChange}
            displayEmpty
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>

        <CSVLink data={exportData} filename="demandes_congés.csv">
          <Button variant="contained" color="primary" style={{ marginTop: '42px' }}>
            Exporter en CSV
          </Button>
        </CSVLink>
      </div>

      <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell>Nom complet</TableCell>
            <TableCell>Type de congé</TableCell>
            <TableCell>Date de début</TableCell>
            <TableCell>Date de fin</TableCell>
            <TableCell>Motif</TableCell>
            <TableCell>Statut HOD</TableCell>
            <TableCell>Statut RH</TableCell>
            <TableCell>Statut CEO</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Organisation</TableCell>
            <TableCell>Date de création</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.fullName}</TableCell>
              <TableCell>{request.leaveType}</TableCell>
              <TableCell>{request.startDate?.toDate().toLocaleDateString()}</TableCell>
              <TableCell>{request.endDate?.toDate().toLocaleDateString()}</TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>{request.HodStatus === 1 ? 'Approuvé' : 'En attente'}</TableCell>
              <TableCell>{request.HrStatus === 1 ? 'Approuvé' : 'En attente'}</TableCell>
              <TableCell>{request.CeoStatus === 1 ? 'Approuvé' : 'En attente'}</TableCell>
              <TableCell>{request.Status === 1 ? 'Approuvé' : 'En attente'}</TableCell>
              <TableCell>{request.organizationID}</TableCell>
              <TableCell>{request.createdAt?.toDate().toLocaleString()}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(request.id)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

};

export default LeavesReq;
