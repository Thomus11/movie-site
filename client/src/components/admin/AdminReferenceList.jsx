import { useState, useEffect } from 'react';
import { getAdminReferences } from '../../api/admin';
// import './AdminReferenceList.css';

const AdminReferenceList = ({ adminId }) => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const response = await getAdminReferences(adminId);
        setReferences(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, [adminId]);

  if (loading) return <div>Loading references...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="reference-list">
      <h3>Admin References</h3>
      {references.length === 0 ? (
        <p>No references found.</p>
      ) : (
        <ul>
          {references.map(ref => (
            <li key={ref.id} className="reference-item">
              <p>{ref.reference_text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReferenceList;