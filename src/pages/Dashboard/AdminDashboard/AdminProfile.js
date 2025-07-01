import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Modal, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'https://zygomorphic-marcille-foodordering-b159eacd.koyeb.app/web/api/admin';

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-list`);
      const data = await response.json();
      
      if (data.status === 1 && data.data.length > 0) {
        setAdmin(data.data[0]);
        setFormData(prev => ({
          ...prev,
          email: data.data[0].email
        }));
      } else {
        setError('Failed to fetch admin data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/update-admin/${admin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.status === 1) {
        setSuccessMessage('Profile updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        fetchAdminProfile();
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setError(data.message || 'Update failed. Please check your current password.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading && !admin) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" style={{ color: '#FA8C16' }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button 
          variant="primary" 
          onClick={fetchAdminProfile}
          style={{ backgroundColor: '#FA8C16', borderColor: '#FA8C16' }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4" style={{ color: '#FA8C16' }}>Admin Profile</h2>

      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <div className="mb-3">
            <strong>Email:</strong> {admin?.email}
          </div>
          <Button 
            onClick={() => setShowModal(true)}
            style={{ 
              backgroundColor: '#FA8C16', 
              borderColor: '#FA8C16',
              fontWeight: '500'
            }}
          >
            Update Profile
          </Button>
        </Card.Body>
      </Card>

      {/* Update Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#FA8C16' }}>Update Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('current')}
                  style={{ borderColor: '#FA8C16' }}
                >
                  {showCurrentPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('new')}
                  style={{ borderColor: '#FA8C16' }}
                >
                  {showNewPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={!formData.newPassword}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('confirm')}
                  style={{ borderColor: '#FA8C16' }}
                >
                  {showConfirmPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              style={{ 
                backgroundColor: '#FA8C16', 
                borderColor: '#FA8C16',
                fontWeight: '500'
              }}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                'Update Profile'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminProfile;