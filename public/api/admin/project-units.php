<?php
require_once __DIR__ . '/../db.php';
cors(); require_admin(); $db = db(); $method = $_SERVER['REQUEST_METHOD'];
$allowed = ['available','reserved','sold','rented'];
if ($method === 'GET') { $projectId = intval($_GET['project_id'] ?? 0); if (!$projectId) json_out(['error' => 'project_id required'], 400); $stmt=$db->prepare('SELECT * FROM project_units WHERE project_id=? ORDER BY floor,unit_number'); $stmt->bind_param('i',$projectId); $stmt->execute(); json_out($stmt->get_result()->fetch_all(MYSQLI_ASSOC)); }
$body = body();
if ($method === 'POST' || $method === 'PUT') {
  $id=intval($body['id']??0); $projectId=intval($body['project_id']??0); $unit=trim($body['unit_number']??''); $status=trim($body['status']??'available');
  if (!$projectId || $unit==='' || !in_array($status,$allowed,true)) json_out(['error'=>'project_id, unit_number and valid status required'],400);
  $title=trim($body['title']??''); $beds=$body['beds']!==''?intval($body['beds']??0):null; $baths=$body['baths']!==''?intval($body['baths']??0):null; $area=$body['area']!==''?floatval($body['area']??0):null; $floor=$body['floor']!==''?intval($body['floor']??0):null; $price=$body['price']!==''?floatval($body['price']??0):null; $currency=trim($body['currency']??'USD'); $image=trim($body['image_url']??''); $desc=trim($body['description']??'');
  if ($method === 'POST') { $stmt=$db->prepare('INSERT INTO project_units (project_id,unit_number,title,beds,baths,area,floor,price,currency,status,image_url,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'); $stmt->bind_param('issiididssss',$projectId,$unit,$title,$beds,$baths,$area,$floor,$price,$currency,$status,$image,$desc); $stmt->execute(); json_out(['id'=>$db->insert_id],201); }
  if (!$id) json_out(['error'=>'id required'],400); $stmt=$db->prepare('UPDATE project_units SET unit_number=?,title=?,beds=?,baths=?,area=?,floor=?,price=?,currency=?,status=?,image_url=?,description=? WHERE id=? AND project_id=?'); $stmt->bind_param('ssiididssssii',$unit,$title,$beds,$baths,$area,$floor,$price,$currency,$status,$image,$desc,$id,$projectId); $stmt->execute(); json_out(['updated'=>$stmt->affected_rows]);
}
if ($method === 'DELETE') { $id=intval($_GET['id']??0); if(!$id)json_out(['error'=>'id required'],400); $stmt=$db->prepare('DELETE FROM project_units WHERE id=?');$stmt->bind_param('i',$id);$stmt->execute();json_out(['deleted'=>$stmt->affected_rows]); }
json_out(['error'=>'Method not allowed'],405);
