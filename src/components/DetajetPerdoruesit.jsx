import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Input, Modal, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "../style/DetajetPerdouresit.css";

function DetajetPerdoruesit({ users, setUsers }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  // Form state për edit
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    company: "",
    address: "",
    phone: "",
    website: ""
  });

  useEffect(() => {
    const localUser = users?.find(u => u.id === Number(id));
    if (localUser) {
      setUser(localUser);
      return;
    }

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log(err));
  }, [id, users]);



  function openEdit() {
    setEditing(true);
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      company: user?.company?.name || "",
      address: user?.address?.street || "",
      phone: user?.phone || "",
      website: user?.website || ""
    });
  }

  function saveEdit() {
    const updatedUser = {
      ...user,
      name: editForm.name,
      email: editForm.email,
      company: { name: editForm.company },
      address: { ...user?.address, street: editForm.address },
      phone: editForm.phone,
      website: editForm.website
    };

     setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    setUser(updatedUser);
    setEditing(false);
  }

  const handleInputChange = (field, value) => {
     setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const companyName = user?.company?.name || "-";
  const addressStr =  `${user?.address?.street || ""}, ${user?.address?.suite || ""}, ${user?.address?.city || ""}, ${user?.address?.zipcode || ""}` || "-";

  const rows = [
    { key: 1, field: "Emri", value: user?.name || "-" },
    { key: 2, field: "Email", value: user?.email || "-" },
    { key: 3, field: "Kompania", value: companyName },
    { key: 4, field: "Adresa", value: addressStr },
    { key: 5, field: "Telefoni", value: user?.phone || "-" },
    { key: 6, field: "Faqja e internetit", value: user?.website || "-" },
  ];

  const columns = [
     { title: "Fusha", dataIndex: "field", key: "field", width: 150 },
    { title: "Vlera", dataIndex: "value", key: "value" },
  ];

  return (
    <div className="detajet">
      <h2 className="titulli">Detajet e përdoruesit</h2>

      <div className="tableUser">
        <Table
           dataSource={rows}
          columns={columns}
          pagination={false}
          bordered
          scroll={{ x: "max-content" }}
        />
      </div>

      <div className="userButton">
         <Button type="primary" icon={<EditOutlined />} onClick={openEdit}>
        
        </Button>
      </div>

      {editing && (
        <Modal
          title="Edit përdorues"
          open={editing}
          onOk={saveEdit}
          onCancel={() => setEditing(false)}
          okText="Ruaj"
          cancelText="Anulo"
        >
          <Input
            className="ModalInput"
            value={editForm.name}
            onChange={e => handleInputChange("name", e.target.value)}
            placeholder="Emri"
          />
          <Input
            className="ModalInput"
            value={editForm.email}
            onChange={e => handleInputChange("email", e.target.value)}
            placeholder="Email"
          />
          <Input
            className="ModalInput"
             value={editForm.company}
            onChange={e => handleInputChange("company", e.target.value)}
            placeholder="Kompania"
          />
          <Input
            className="ModalInput"
            value={editForm.address}
            onChange={e => handleInputChange("address", e.target.value)}
            placeholder="Adresa"
          />
          <Input
            className="ModalInput"
            value={editForm.phone}
            onChange={e => handleInputChange("phone", e.target.value)}
            placeholder="Telefoni"
          />
           <Input
            className="ModalInput"
            value={editForm.website}
            onChange={e => handleInputChange("website", e.target.value)}
            placeholder="Faqja e internetit"
          />
        </Modal>
      )}
    </div>
  );
}

export default DetajetPerdoruesit;
