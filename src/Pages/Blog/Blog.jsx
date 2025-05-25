import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Blog() {
  const [blogPost, setBlogPost] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `https://life-sync-server-eight.vercel.app/blog-post/status`
      );
      setBlogPost(data);
    })();
  }, []);
  console.log(blogPost);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Latest Blog Posts
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPost?.map(post => (
            <div
              key={post?.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden group relative"
            >
              <img
                src={post?.photoURL}
                alt={post?.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 group-hover:text-blue-500 transition-all duration-300 line-clamp-2">
                  {post?.title}
                </h2>
                <div
                  className="text-gray-700 mb-4 line-clamp-4" // Limit to 4 lines for description
                  dangerouslySetInnerHTML={{
                    __html: `${post?.content.slice(0, 300)}${
                      post?.content.length > 300 ? '...' : ''
                    }`,
                  }}
                ></div>
                <div className="flex justify-between items-center text-gray-500">
                  <p>By {post?.authorName}</p>
                  <p>{new Date(post?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex justify-center items-center mb-4 lg:mb-8">
                <Link to={`/view-full-blog/${post?._id}`}>
                  <button className="btn btn-primary">View Full Blog</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  
}

export default Blog;
