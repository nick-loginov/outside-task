SELECT * FROM users LEFT JOIN (user_tag JOIN tags ON tag_id = ut_tag_id) ON user_uid = ut_user_id WHERE user_uid = '23093248-1beb-11ec-9621-0242ac130003';
