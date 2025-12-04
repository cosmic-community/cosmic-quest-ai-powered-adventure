import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-box max-w-2xl text-center">
        <h2 className="text-4xl text-nes-yellow mb-4">
          404
        </h2>
        <p className="text-lg mb-2">
          You've wandered into the void...
        </p>
        <p className="text-sm text-nes-gray mb-6">
          This path doesn't exist in our realm.
        </p>
        <Link href="/">
          <button className="pixel-button">
            RETURN HOME
          </button>
        </Link>
      </div>
    </div>
  )
}