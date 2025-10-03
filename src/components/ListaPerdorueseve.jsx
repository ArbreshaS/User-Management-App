import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { App, Table, Input, Card, Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../style/ListaPerdoruesve.css";

function ListaPerdorueseve({ users, setUsers }) {
  const { modal } = App.useApp();
  const [kerko, setKerko] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCompany, setEditCompany] = useState("");

  useEffect(() => {
    if (users.length === 0) {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.log(err));
    }
  }, [users, setUsers]);
//shtojme perdorues te ri lokalisht
  function shtoPerdorues() {
    if (!name.trim() || !email.trim()) {
       modal.error({ title: "Gabim", content:  "Plotëso Emrin dhe Email-in" });
      return;
    }
    const newUser = {
      id: users.length + 1,
      name,
      email,
      company: { name: company || "-" },
      address: { street: address || "-", suite: "", city: "", zipcode: "" },
      phone: phone || "-",
      website: website || "-",
    };
    setUsers([newUser, ...users]);
     modal.success({ title: "Sukses", content: "Përdoruesi u shtua me sukses!" });
    setName(""); setEmail(""); setCompany(""); setAddress(""); setPhone(""); setWebsite("");
  }

  function handleDelete(id) {
    setUsers(users.filter(u => u.id !== id));
  }

  function openEditModal(user) {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditCompany(user.company?.name || "");
  }

  function saveEdit() {
    setUsers(users.map(u => u.id === editingUser.id ? {
       ...u,
      name: editName,
      email: editEmail,
      company: { name: editCompany }
    } : u));
    setEditingUser(null);
    modal.success({ title: "Sukses", content: "Përdoruesi u përditësua!" });
  }

  const kolonat = [
    {
      title: "Emri",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Link className="Link" to={`/perdorues/${record.id}`}>{text}</Link>,
      //sortimi permes antd
      sorter: (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" })
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email, "en", { sensitivity: "base" })
    },
    {
      title: "Kompania",
      dataIndex: ["company", "name"],
      key: "company",
      sorter: (a, b) => (a.company?.name || "").localeCompare(b.company?.name || "", "en", { sensitivity: "base" })
    },
    {
      title: "Veprime",
      key: "actions",
      render: (_, record) => (
        <div className="actionB">
          < Button type="primary" icon={<EditOutlined />} onClick={() => openEditModal(record)}></Button>
          <Button type="default" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}></Button>
        </div>
      )
    }
  ];
//search
  const teFiltruara = users.filter(
      p => p.name.toLowerCase().includes(kerko.toLowerCase())
      || p.email.toLowerCase().includes(kerko.toLowerCase())
      || p.company.name.toLowerCase().includes(kerko.toLowerCase())
  );

  return (
    <div className="container">
       <Input.Search
        className="search"
        placeholder="Kërko përdorues me emër, email ose kompani"
        value={kerko}
        onChange={e => setKerko(e.target.value)}
        allowClear
      />

       <Card className="card" >
        <Table
          dataSource={teFiltruara}
          columns={kolonat}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          bordered
          scroll={{ x: "max-content" }}
        />

        <Card className="form">
          <Input className="input" placeholder="Emri" value={name} onChange={e => setName(e.target.value)} />
          <Input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input className="input" placeholder="Kompania" value={company} onChange={e => setCompany(e.target.value)} />
          <Input className="input" placeholder="Adresa" value={address} onChange={e => setAddress(e.target.value)} />
          <Input className="input" placeholder="Telefoni" value={phone} onChange={e => setPhone(e.target.value)} />
          <div  className="butoni">
            <Button  type="primary" onClick={shtoPerdorues}>Shto përdorues</Button>
           </div>
        </Card>
      </Card>

      {editingUser && (
         <Modal
          title="Përditëso përdoruesin"
          open={!!editingUser}
          onOk={saveEdit}
          onCancel={() => setEditingUser(null)}
          okText="Ruaj"
          cancelText="Anulo"
      >
           <Input className="formInput"  value={editName} onChange={e => setEditName(e.target.value)} placeholder="Emri" />
          <Input className="formInput" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email" />
          <Input  className="formInput" value={editCompany}  onChange={e => setEditCompany(e.target.value)} placeholder="Kompania" />
        </Modal>
      )}
    </div>
  );
}

export default ListaPerdorueseve;
