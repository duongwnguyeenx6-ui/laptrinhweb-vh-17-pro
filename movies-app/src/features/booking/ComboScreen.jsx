import React, { useState } from 'react';

function ComboScreen({ ticketTotal = 0, selectedSeatCount = 0, onBack, onNext }) {
  const combos = [
    { id: 'popcorn-small', name: 'Bắp nhỏ', price: 30000 },
    { id: 'popcorn-large', name: 'Bắp lớn', price: 50000 },
    { id: 'drink', name: 'Nước', price: 25000 }
  ];

  const promoTypes = [
    { id: 'none', title: 'Không ưu đãi', description: 'Tiếp tục bình thường, không áp dụng điều kiện ưu đãi.' },
    { id: 'student', title: 'Sinh viên', description: 'Yêu cầu thông tin trường và khóa học, đã xuất trình thẻ.' },
    { id: 'child', title: 'Trẻ em', description: 'Xác nhận trẻ em dưới 14 tuổi để nhận ưu đãi vé.' },
    { id: 'group', title: 'Nhóm 5 người', description: 'Cần cung cấp 5 bộ CCCD hoặc họ tên để áp dụng giá ưu đãi.' },
    { id: 'couple', title: 'Cặp đôi', description: 'Tải lên ảnh cặp đôi để nhận ưu đãi giá combo.' }
  ];

  const [counts, setCounts] = useState({});
  const [promoType, setPromoType] = useState('none');
  const [studentInfo, setStudentInfo] = useState({ school: '', course: '', shownCard: false });
  const [childInfo, setChildInfo] = useState({ birthDate: '', confirmed: false });
  const [groupMembers, setGroupMembers] = useState(Array.from({ length: 5 }, () => ({ cccd: '', fullName: '' })));
  const [promoConfirmed, setPromoConfirmed] = useState(false);
  const [coupleFile, setCoupleFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const groupSize = counts['drink'] || 0;
  const freeDrinkCount = groupSize >= 5 ? 1 : 0;

  const changeCount = (id, delta) => {
    const prev = counts[id] || 0;
    const next = Math.max(0, prev + delta);
    setCounts({ ...counts, [id]: next });
  };

  const comboTotal = combos.reduce((sum, c) => sum + (counts[c.id] || 0) * c.price, 0);
  const perTicketPrice = selectedSeatCount > 0 ? Math.round(ticketTotal / selectedSeatCount) : 0;
  const ticketPriceInfo = selectedSeatCount > 0 ? `${perTicketPrice.toLocaleString()} VNĐ / vé` : 'Chưa chọn vé';

  const getAge = (birthDate) => {
    if (!birthDate) return null;
    const diffMs = Date.now() - new Date(birthDate).getTime();
    return Math.floor(diffMs / 1000 / 60 / 60 / 24 / 365.25);
  };

  const childAge = getAge(childInfo.birthDate);
  const studentComplete = studentInfo.school.trim() && studentInfo.course.trim() && studentInfo.shownCard;
  const childComplete = childInfo.birthDate && childInfo.confirmed && childAge !== null && childAge < 14;
  const groupComplete = selectedSeatCount === 5 && groupMembers.every(m => m.cccd.trim() && m.fullName.trim());
  const coupleComplete = coupleFile !== null;
  const noneComplete = promoType === 'none';

  const studentValid = studentComplete && promoConfirmed;
  const childValid = childComplete && promoConfirmed;
  const groupValid = groupComplete && promoConfirmed;
  const coupleValid = coupleComplete && promoConfirmed;
  const noneValid = noneComplete && promoConfirmed;

  const promoValid = noneValid
    || (promoType === 'student' && studentValid)
    || (promoType === 'child' && childValid)
    || (promoType === 'group' && groupValid)
    || (promoType === 'couple' && coupleValid);

  const promoInfo = {
    type: promoType,
    valid: promoValid,
    data: {
      student: promoType === 'student' ? { ...studentInfo, confirmed: promoConfirmed } : undefined,
      child: promoType === 'child' ? { birthDate: childInfo.birthDate, age: childAge, confirmed: promoConfirmed } : undefined,
      group: promoType === 'group' ? { members: groupMembers, confirmed: promoConfirmed } : undefined,
      couple: promoType === 'couple' ? { fileName: coupleFile?.name, fileType: coupleFile?.type, confirmed: promoConfirmed } : undefined,
      none: promoType === 'none' ? { confirmed: promoConfirmed } : undefined
    }
  };

  const handleGroupMemberChange = (index, field, value) => {
    setGroupMembers(prev => prev.map((member, idx) => idx === index ? { ...member, [field]: value } : member));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setCoupleFile(null);
      setUploadError('');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Chỉ chấp nhận ảnh .jpg hoặc .png.');
      setCoupleFile(null);
      return;
    }
    setUploadError('');
    setCoupleFile(file);
  };

  const handleContinue = () => {
    setShowErrors(true);
    if (!promoValid) return;

    // If couple promo is active and valid, automatically add 1 popcorn-large + 1 drink
    let adjustedCounts = { ...counts };
    let adjustedComboTotal = comboTotal;
    let outgoingPromoInfo = { ...promoInfo, data: { ...promoInfo.data } };

    if (promoType === 'couple' && promoValid) {
      const popPrice = combos.find(c => c.id === 'popcorn-large')?.price || 0;
      const drinkPrice = combos.find(c => c.id === 'drink')?.price || 0;
      adjustedCounts['popcorn-large'] = (adjustedCounts['popcorn-large'] || 0) + 1;
      adjustedCounts['drink'] = (adjustedCounts['drink'] || 0) + 1;
      adjustedComboTotal = adjustedComboTotal + popPrice + drinkPrice;
      outgoingPromoInfo = {
        ...outgoingPromoInfo,
        data: {
          ...outgoingPromoInfo.data,
          couple: {
            ...outgoingPromoInfo.data.couple,
            comboAdded: true,
            comboItems: { 'popcorn-large': 1, drink: 1 }
          }
        }
      };
    }

    onNext({ comboCounts: adjustedCounts, comboTotal: adjustedComboTotal, promoInfo: outgoingPromoInfo });
  };

  return (
    <div style={{ color: '#ffffff', minHeight: '80vh' }}>
      <button
        className="btn mb-4 fw-bold text-white border-0"
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
          boxShadow: '0 18px 28px rgba(124, 58, 237, 0.28)'
        }}
        onClick={onBack}
      >⬅ Quay lại chọn ghế</button>

      <div
        className="card p-4 shadow-sm border-0"
        style={{
          background: 'rgba(15, 23, 42, 0.94)',
          border: '1px solid rgba(79, 70, 229, 0.18)'
        }}
      >
        <h3 className="fw-bold mb-3" style={{ color: '#c4b5fd' }}>Ưu đãi & Combo vé</h3>

        <div className="row g-3 mb-4">
          {promoTypes.map((promo) => (
            <div key={promo.id} className="col-12 col-md-6 col-xl-4">
              <button
                type="button"
                className="btn w-100 text-start py-3"
                style={{
                  borderRadius: 18,
                  background: promoType === promo.id ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : 'rgba(255, 255, 255, 0.06)',
                  color: promoType === promo.id ? '#fff' : '#e2e8f0',
                  border: promoType === promo.id ? '1px solid rgba(124, 58, 237, 0.45)' : '1px solid rgba(148, 163, 184, 0.12)'
                }}
                onClick={() => { setPromoType(promo.id); setPromoConfirmed(false); }}
              >
                <div className="fw-bold mb-1">{promo.title}</div>
                <div className="small" style={{ color: promoType === promo.id ? '#e0e7ff' : '#94a3b8' }}>{promo.description}</div>
              </button>
            </div>
          ))}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.14)' }}>
                <div className="small text-white mb-1">Ghế đã chọn</div>
                <div className="fw-bold fs-5 text-white">{selectedSeatCount}</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.14)' }}>
              <div className="small text-white mb-1">Giá vé mỗi ghế</div>
              <div className="fw-bold fs-5 text-white">{ticketPriceInfo}</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(148, 163, 184, 0.14)' }}>
              <div className="small text-white mb-1">Tổng vé</div>
              <div className="fw-bold fs-5 text-white">{ticketTotal.toLocaleString()} VNĐ</div>
            </div>
          </div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="p-3 rounded-3" style={{ background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(124, 58, 237, 0.18)' }}>
                <div className="fw-bold mb-2 text-white">Combo hiện tại</div>
              {Object.entries(counts).filter(([, value]) => value > 0).length === 0 ? (
                <div className="small text-white">Chưa có combo nào được thêm.</div>
              ) : (
                <div className="small text-white">
                  {combos.filter(c => counts[c.id] > 0).map(c => `${counts[c.id]} × ${c.name}`).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {promoType === 'student' && (
          <div className="mb-4" style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(99, 102, 241, 0.18)', background: 'rgba(99, 102, 241, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="fw-bold mb-3" style={{ color: '#c4b5fd' }}>Thông tin Sinh viên</div>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small">Tên trường</label>
              <input type="text" className="form-control" value={studentInfo.school} onChange={(e) => setStudentInfo({ ...studentInfo, school: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small">Khóa học</label>
              <input type="text" className="form-control" value={studentInfo.course} onChange={(e) => setStudentInfo({ ...studentInfo, course: e.target.value })} />
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="shownCard" checked={studentInfo.shownCard} onChange={(e) => setStudentInfo({ ...studentInfo, shownCard: e.target.checked })} />
              <label className="form-check-label text-secondary ms-2" htmlFor="shownCard">Tôi đã xuất trình thẻ sinh viên.</label>
            </div>
            {studentComplete && !promoConfirmed && (
              <div className="mt-2 d-flex align-items-center gap-2">
                <button type="button" className="btn btn-sm fw-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', borderRadius: 8 }} onClick={() => setPromoConfirmed(true)}>Xác nhận</button>
              </div>
            )}
            {promoConfirmed && promoType === 'student' && (
              <div className="small text-success mt-2">Đã xác nhận</div>
            )}

            {showErrors && !studentValid && (
              <div className="text-danger small mt-2">Vui lòng điền đầy đủ thông tin trường, khóa học, xuất trình thẻ và bấm OK.</div>
            )}
          </div>
        )}

        {promoType === 'child' && (
          <div className="mb-4" style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(16, 185, 129, 0.18)', background: 'rgba(16, 185, 129, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="fw-bold mb-3" style={{ color: '#a7f3d0' }}>Thông tin Trẻ em</div>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small">Ngày sinh</label>
              <input type="date" className="form-control" value={childInfo.birthDate} onChange={(e) => setChildInfo({ ...childInfo, birthDate: e.target.value })} />
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="childConfirmed" checked={childInfo.confirmed} onChange={(e) => setChildInfo({ ...childInfo, confirmed: e.target.checked })} />
              <label className="form-check-label text-secondary ms-2" htmlFor="childConfirmed">Xác nhận trẻ em dưới 14 tuổi.</label>
            </div>
            {childComplete && !promoConfirmed && (
              <div className="mt-2 d-flex align-items-center gap-2">
                <button type="button" className="btn btn-sm fw-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', borderRadius: 8 }} onClick={() => setPromoConfirmed(true)}>Xác nhận</button>
              </div>
            )}
            {promoConfirmed && promoType === 'child' && (
              <div className="small text-success mt-2">Đã xác nhận</div>
            )}

            {showErrors && !childValid && (
              <div className="text-danger small mt-2">Vui lòng chọn ngày sinh hợp lệ, xác nhận trẻ em và bấm OK.</div>
            )}
          </div>
        )}

        {promoType === 'none' && (
          <div className="mb-4" style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(148, 163, 184, 0.18)', background: 'rgba(148, 163, 184, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="fw-bold mb-3" style={{ color: '#cbd5e1' }}>Không áp dụng ưu đãi</div>
            </div>
            {noneComplete && !promoConfirmed && (
              <div className="mt-2 d-flex align-items-center gap-2">
                <button type="button" className="btn btn-sm fw-bold" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: '#fff', borderRadius: 8 }} onClick={() => setPromoConfirmed(true)}>Xác nhận</button>
              </div>
            )}
            {promoConfirmed && promoType === 'none' && (
              <div className="small text-success mt-2">Đã xác nhận</div>
            )}
            {showErrors && !noneValid && (
              <div className="text-danger small mt-2">Vui lòng xác nhận OK để tiếp tục với giá gốc.</div>
            )}
          </div>
        )}

        {promoType === 'group' && (
          <div className="mb-4" style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(244, 63, 94, 0.18)', background: 'rgba(244, 63, 94, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="fw-bold mb-3" style={{ color: '#fecaca' }}>Thông tin Nhóm 5 người</div>
            </div>
            {groupMembers.map((member, index) => (
              <div key={index} className="mb-3" style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)' }}>
                <div className="fw-bold mb-2">Thành viên {index + 1}</div>
                <div className="mb-2">
                  <label className="form-label text-secondary small">Số CCCD</label>
                  <input type="text" className="form-control" value={member.cccd} onChange={(e) => handleGroupMemberChange(index, 'cccd', e.target.value)} />
                </div>
                <div>
                  <label className="form-label text-secondary small">Họ tên</label>
                  <input type="text" className="form-control" value={member.fullName} onChange={(e) => handleGroupMemberChange(index, 'fullName', e.target.value)} />
                </div>
              </div>
            ))}
            {groupComplete && !promoConfirmed && (
              <div className="mt-2 d-flex align-items-center gap-2">
                <button type="button" className="btn btn-sm fw-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', borderRadius: 8 }} onClick={() => setPromoConfirmed(true)}>Xác nhận</button>
              </div>
            )}
 
            {showErrors && !groupValid && (
              <div className="text-danger small mt-2">Cần cung cấp đủ 5 bộ CCCD và họ tên, chọn đúng 5 vé và đánh dấu OK để nhận ưu đãi nhóm.</div>
            )}
          </div>
        )}

        {promoType === 'couple' && (
          <div className="mb-4" style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(168, 85, 247, 0.18)', background: 'rgba(168, 85, 247, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="fw-bold mb-3" style={{ color: '#d8b4fe' }}>Thông tin Cặp đôi</div>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary small">Tải ảnh cặp đôi</label>
              <input type="file" accept="image/jpeg,image/png" className="form-control" onChange={handleFileUpload} />
            </div>
            {coupleFile && (
              <div className="small text-secondary">Đã chọn: {coupleFile.name}</div>
            )}
            {coupleComplete && !promoConfirmed && (
              <div className="mt-2 d-flex align-items-center gap-2">
                <button type="button" className="btn btn-sm fw-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', borderRadius: 8 }} onClick={() => setPromoConfirmed(true)}>Xác nhận</button>
              </div>
            )}
            {promoConfirmed && promoType === 'couple' && (
              <div className="small text-success mt-2">Đã xác nhận</div>
            )}
            {uploadError && (
              <div className="text-danger small mt-2">{uploadError}</div>
            )}
            {showErrors && !coupleValid && (
              <div className="text-danger small mt-2">Vui lòng tải lên ảnh cặp đôi định dạng .jpg hoặc .png và bấm OK.</div>
            )}
          </div>
        )}

        <div className="row g-3">
          {combos.map(c => (
            <div
              key={c.id}
              className="col-12 d-flex align-items-center justify-content-between p-3"
              style={{
                borderRadius: 16,
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(148, 163, 184, 0.12)'
              }}
            >
              <div>
                <div className="fw-bold" style={{ color: '#e2e8f0' }}>{c.name}</div>
                <div className="small" style={{ color: '#94a3b8' }}>{c.price.toLocaleString()} VNĐ</div>
                {c.id === 'drink' && (
                  <div className="small mt-1" style={{ color: '#a5b4fc' }}>Đặt 5 nước trở lên tặng 1 nước miễn phí.</div>
                )}
                {c.id === 'popcorn-large' && (
                  <div className="small mt-1" style={{ color: '#a5b4fc' }}>Combo cặp đôi: bắp lớn + nước là lựa chọn lý tưởng.</div>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(148, 163, 184, 0.22)',
                    width: '36px',
                    height: '36px'
                  }}
                  onClick={() => changeCount(c.id, -1)}
                >-</button>
                <div style={{ minWidth: 28, textAlign: 'center', color: '#e2e8f0' }}>{counts[c.id] || 0}</div>
                <button
                  className="btn btn-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(148, 163, 184, 0.22)',
                    width: '36px',
                    height: '36px'
                  }}
                  onClick={() => changeCount(c.id, 1)}
                >+</button>
              </div>
            </div>
          ))}
        </div>

        {freeDrinkCount > 0 && (
          <div className="mb-3" style={{ padding: '14px 18px', borderRadius: 18, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.18)', color: '#d1fae5' }}>
            🎁 Chúc mừng! Bạn đủ điều kiện nhận <strong>{freeDrinkCount} nước miễn phí</strong> khi đặt 5 nước trở lên.
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-4" style={{ color: '#cbd5e1' }}>
          <div className="fw-bold">Tổng Combo:</div>
          <div className="fs-5 fw-bold" style={{ color: '#c4b5fd' }}>{comboTotal.toLocaleString()} VNĐ</div>
        </div>

        <div className="d-flex gap-2 mt-4 flex-wrap">
          <button
            className="btn fw-bold py-2"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#e2e8f0',
              borderRadius: 10,
              minWidth: '120px'
            }}
            onClick={onBack}
          >Quay lại</button>
          <button
            className="btn fw-bold py-2"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#cbd5e1',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              borderRadius: 10,
              minWidth: '160px'
            }}
            onClick={() => onNext({ comboCounts: {}, comboTotal: 0, promoInfo })}
          >Bỏ qua mua combo</button>
          <button
            className="btn fw-bold text-white py-2"
            style={{
              background: promoValid ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : 'rgba(124, 58, 237, 0.35)',
              borderRadius: 10,
              minWidth: '160px'
            }}
            onClick={handleContinue}
            disabled={!promoValid}
          >Tiếp tục thanh toán</button>
        </div>
      </div>
    </div>
  );
}

export default ComboScreen;
