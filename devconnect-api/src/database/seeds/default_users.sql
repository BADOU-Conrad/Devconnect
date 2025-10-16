INSERT INTO Users (username, password, email, created_at) VALUES 
('admin', 'hashed_password_admin', 'admin@example.com', CURRENT_TIMESTAMP),
('user1', 'hashed_password_user1', 'user1@example.com', CURRENT_TIMESTAMP),
('user2', 'hashed_password_user2', 'user2@example.com', CURRENT_TIMESTAMP);

INSERT INTO Projects (name, description, created_at) VALUES 
('Project Alpha', 'Description for Project Alpha', CURRENT_TIMESTAMP),
('Project Beta', 'Description for Project Beta', CURRENT_TIMESTAMP);

INSERT INTO ProjectMembers (user_id, project_id, role) VALUES 
(1, 1, 'admin'), 
(2, 1, 'user'), 
(3, 2, 'user');

INSERT INTO Tasks (title, description, project_id, created_at) VALUES 
('Task 1 for Project Alpha', 'Description for Task 1', 1, CURRENT_TIMESTAMP),
('Task 2 for Project Alpha', 'Description for Task 2', 1, CURRENT_TIMESTAMP),
('Task 1 for Project Beta', 'Description for Task 1', 2, CURRENT_TIMESTAMP);

INSERT INTO Comments (task_id, user_id, content, created_at) VALUES 
(1, 1, 'This is a comment on Task 1 for Project Alpha', CURRENT_TIMESTAMP),
(2, 2, 'This is a comment on Task 2 for Project Alpha', CURRENT_TIMESTAMP),
(3, 3, 'This is a comment on Task 1 for Project Beta', CURRENT_TIMESTAMP);