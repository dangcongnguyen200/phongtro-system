import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold mb-3">Không tìm thấy</h1>
      <p className="text-gray-500 mb-6">Phòng đã khóa, đã xóa, hoặc đường dẫn sai.</p>
      <Link href="/phong" className="text-blue-600 font-medium">
        Về danh sách phòng
      </Link>
    </div>
  );
}
